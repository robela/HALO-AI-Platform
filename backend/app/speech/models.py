from datetime import datetime, timezone
from sqlalchemy import DateTime, Float, Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from ..models import Base


class TranscriptionDB(Base):
    __tablename__ = "transcriptions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    # nullable – anonymous / unauthenticated sessions allowed
    user_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    audio_filename: Mapped[str | None] = mapped_column(String, nullable=True)
    transcript: Mapped[str] = mapped_column(String, nullable=False)
    language: Mapped[str] = mapped_column(String(10), nullable=False, default="en")
    duration_seconds: Mapped[float | None] = mapped_column(Float, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
