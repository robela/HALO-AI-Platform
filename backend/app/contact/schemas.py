from typing import Optional

from pydantic import BaseModel, EmailStr, Field, field_validator


class ContactSubmit(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    email: EmailStr
    company: Optional[str] = None
    message: str = Field(..., min_length=1)

    @field_validator("message")
    @classmethod
    def message_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Message cannot be empty")
        return v.strip()


class ContactResponse(BaseModel):
    success: bool
    message: str
