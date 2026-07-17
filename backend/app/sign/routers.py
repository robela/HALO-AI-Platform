from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from ..auth.dependencies import authenticate_user
from ..auth.models import UserDB
from ..database import get_async_session
from .models import SignRequestDB
from .schemas import SignGenerateRequest, SignGenerateResponse
from .service import generate_sign_language

TAG_METADATA = {
    "name": "Sign Language",
    "description": "Convert text to sign-language video or avatar output.",
}

router = APIRouter(prefix="/api/v1/sign", tags=["Sign Language"])


@router.post(
    "/generate",
    response_model=SignGenerateResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Generate sign-language output for a text string",
)
async def generate_sign(
    payload: SignGenerateRequest,
    asession: AsyncSession = Depends(get_async_session),
    current_user: UserDB | None = Depends(authenticate_user),
):
    result = await generate_sign_language(payload.text, language=payload.language.value)

    record = SignRequestDB(
        user_id=current_user.id if current_user else None,
        input_text=payload.text,
        language=payload.language.value,
        video_url=result.video_url,
        status=result.status,
    )
    asession.add(record)
    await asession.commit()
    await asession.refresh(record)

    return SignGenerateResponse.model_validate(record)
