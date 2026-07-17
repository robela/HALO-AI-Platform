from pydantic import BaseModel, EmailStr, field_validator
from datetime import datetime
from typing import Optional


# ─── User ────────────────────────────────────────────────────────────────────

class UserBase(BaseModel):
    name: str
    email: EmailStr


class UserRegister(UserBase):
    password: str

    @field_validator("password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        return v


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class GoogleAuthRequest(BaseModel):
    credential: str   # Google ID token


class UserOut(UserBase):
    id: int
    avatar_url: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


# ─── Auth responses ──────────────────────────────────────────────────────────

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


# ─── Contact ─────────────────────────────────────────────────────────────────

class ContactSubmit(BaseModel):
    name: str
    email: EmailStr
    company: Optional[str] = None
    message: str

    @field_validator("message")
    @classmethod
    def message_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Message cannot be empty")
        return v.strip()


class ContactResponse(BaseModel):
    success: bool
    message: str
