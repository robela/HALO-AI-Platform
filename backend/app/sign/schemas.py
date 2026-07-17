from datetime import datetime
from enum import StrEnum
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

from .models import SignStatus


class SignLanguageCode(StrEnum):
    en = "en"   # American Sign Language (ASL)
    am = "am"   # Ethiopian Sign Language (proxy)


class SignGenerateRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=500)
    language: SignLanguageCode = SignLanguageCode.en


class SignGenerateResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    input_text: str
    language: str
    video_url: Optional[str] = None
    status: str
    created_at: datetime
