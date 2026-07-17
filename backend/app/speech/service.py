"""Speech recognition service using faster-whisper.

The Whisper model is loaded once per process and stored on app.state so it is
shared across requests (no repeated disk I/O or GPU allocation).

Usage from a router:
    from fastapi import Request
    model = request.app.state.whisper_model
    result = await transcribe_bytes(model, audio_bytes, language="auto")
"""

from __future__ import annotations

import io
import tempfile
import os
from dataclasses import dataclass
from typing import Optional

# faster-whisper is an optional dependency; fall back gracefully so the rest
# of the app starts even without the heavy AI stack installed.
try:
    from faster_whisper import WhisperModel  # type: ignore
    _WHISPER_AVAILABLE = True
except ImportError:
    WhisperModel = None  # type: ignore
    _WHISPER_AVAILABLE = False

from ..logging_utils import get_logger

logger = get_logger(__name__)

# Default model size – override via env var WHISPER_MODEL_SIZE
_MODEL_SIZE = os.getenv("WHISPER_MODEL_SIZE", "base")
_DEVICE = os.getenv("WHISPER_DEVICE", "cpu")
_COMPUTE_TYPE = os.getenv("WHISPER_COMPUTE_TYPE", "int8")

_whisper_model: "WhisperModel | None" = None


@dataclass
class TranscribeResult:
    transcript: str
    language: str
    duration_seconds: Optional[float]


def load_whisper_model() -> "WhisperModel | None":
    """Load (or return cached) Whisper model. Called once during lifespan startup."""
    global _whisper_model
    if not _WHISPER_AVAILABLE:
        logger.warning("faster-whisper not installed – transcription will return stubs.")
        return None
    if _whisper_model is None:
        logger.info("Loading Whisper model '%s' on %s …", _MODEL_SIZE, _DEVICE)
        _whisper_model = WhisperModel(_MODEL_SIZE, device=_DEVICE, compute_type=_COMPUTE_TYPE)
        logger.info("Whisper model ready.")
    return _whisper_model


async def transcribe_bytes(
    model: "WhisperModel | None",
    audio_bytes: bytes,
    language: str = "auto",
    filename: str = "audio.wav",
) -> TranscribeResult:
    """Transcribe raw audio bytes and return a TranscribeResult."""
    if model is None:
        # Stub response when AI stack is not available (dev / CI)
        return TranscribeResult(
            transcript="[Whisper not available – install faster-whisper]",
            language=language if language != "auto" else "en",
            duration_seconds=None,
        )

    lang_arg = None if language == "auto" else language

    # faster-whisper requires a file path; write to a temp file
    with tempfile.NamedTemporaryFile(suffix=f"_{filename}", delete=False) as tmp:
        tmp.write(audio_bytes)
        tmp_path = tmp.name

    try:
        segments, info = model.transcribe(tmp_path, language=lang_arg, beam_size=5)
        full_text = " ".join(seg.text.strip() for seg in segments)
        return TranscribeResult(
            transcript=full_text,
            language=info.language,
            duration_seconds=round(info.duration, 2),
        )
    finally:
        os.unlink(tmp_path)
