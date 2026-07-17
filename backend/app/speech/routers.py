import json

from fastapi import APIRouter, Depends, File, HTTPException, Request, UploadFile, WebSocket, WebSocketDisconnect, status
from sqlalchemy.ext.asyncio import AsyncSession

from ..auth.dependencies import authenticate_user
from ..auth.models import UserDB
from ..database import get_async_session
from .models import TranscriptionDB
from .schemas import CaptionChunk, LanguageCode, StreamingError, TranscribeResponse
from .service import transcribe_bytes

TAG_METADATA = {
    "name": "Speech",
    "description": "Real-time speech-to-text transcription and live caption streaming.",
}

router = APIRouter(prefix="/api/v1/speech", tags=["Speech"])

_MAX_AUDIO_BYTES = 25 * 1024 * 1024  # 25 MB


# ── REST: single-file transcription ───────────────────────────────────────

@router.post(
    "/transcribe",
    response_model=TranscribeResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Transcribe an uploaded audio file",
)
async def transcribe_audio(
    request: Request,
    file: UploadFile = File(...),
    language: LanguageCode = LanguageCode.auto,
    asession: AsyncSession = Depends(get_async_session),
    current_user: UserDB | None = Depends(authenticate_user),
):
    audio_bytes = await file.read(_MAX_AUDIO_BYTES)
    if len(audio_bytes) == _MAX_AUDIO_BYTES:
        raise HTTPException(status_code=413, detail="Audio file exceeds the 25 MB limit.")

    model = getattr(request.app.state, "whisper_model", None)
    result = await transcribe_bytes(model, audio_bytes, language=language.value, filename=file.filename or "audio")

    record = TranscriptionDB(
        user_id=current_user.id if current_user else None,
        audio_filename=file.filename,
        transcript=result.transcript,
        language=result.language,
        duration_seconds=result.duration_seconds,
    )
    asession.add(record)
    await asession.commit()
    await asession.refresh(record)

    return TranscribeResponse.model_validate(record)


# ── WebSocket: live caption streaming ─────────────────────────────────────

@router.websocket("/stream")
async def stream_captions(
    websocket: WebSocket,
    request: Request,
    language: str = "auto",
):
    """
    Accept raw audio chunks over WebSocket and emit CaptionChunk JSON back.

    Client protocol:
      1. Send binary audio frames (PCM / WAV chunks).
      2. Send the text message "END" to signal end-of-stream.
      3. Receive JSON-encoded CaptionChunk objects.
    """
    await websocket.accept()
    model = getattr(websocket.app.state, "whisper_model", None)
    buffer = bytearray()

    try:
        while True:
            message = await websocket.receive()

            if "bytes" in message and message["bytes"]:
                buffer.extend(message["bytes"])

            elif "text" in message:
                text = message["text"]
                if text.strip().upper() == "END":
                    # Flush accumulated buffer → transcribe
                    if buffer:
                        result = await transcribe_bytes(
                            model, bytes(buffer), language=language
                        )
                        chunk = CaptionChunk(
                            text=result.transcript,
                            is_final=True,
                            language=result.language,
                        )
                        await websocket.send_text(chunk.model_dump_json())
                    buffer.clear()
                else:
                    # Treat arbitrary text as a partial flush trigger
                    if buffer:
                        result = await transcribe_bytes(
                            model, bytes(buffer), language=language
                        )
                        chunk = CaptionChunk(
                            text=result.transcript,
                            is_final=False,
                            language=result.language,
                        )
                        await websocket.send_text(chunk.model_dump_json())
                        buffer.clear()

    except WebSocketDisconnect:
        pass
    except Exception as exc:
        err = StreamingError(error=str(exc))
        await websocket.send_text(err.model_dump_json())
        await websocket.close(code=1011)
