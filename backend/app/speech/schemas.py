from datetime import datetime
from enum import StrEnum
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class LanguageCode(StrEnum):
    en = "en"
    am = "am"   # Amharic
    auto = "auto"


class TranscribeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    transcript: str
    language: str
    duration_seconds: Optional[float] = None
    created_at: datetime


# ── WebSocket / streaming ──────────────────────────────────────────────────

class CaptionChunk(BaseModel):
    """Emitted over the WebSocket for each recognised segment."""
    text: str
    is_final: bool = False
    language: str = "en"
    timestamp_ms: Optional[int] = None


class StreamingError(BaseModel):
    error: str
