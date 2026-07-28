import httpx
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..config import Settings
from ..database import get_async_session
from .dependencies import authenticate_user
from .models import UserDB
from .schemas import GoogleAuthRequest, TokenResponse, UserLogin, UserOut, UserRegister
from .service import create_access_token, hash_password, verify_password

TAG_METADATA = {"name": "Auth", "description": "Registration, login and Google OAuth."}

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(
    payload: UserRegister,
    asession: AsyncSession = Depends(get_async_session),
):
    result = await asession.execute(select(UserDB).where(UserDB.email == payload.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")

    user = UserDB(
        name=payload.name,
        email=payload.email,
        hashed_password=hash_password(payload.password),
    )
    asession.add(user)
    await asession.commit()
    await asession.refresh(user)

    token = create_access_token({"sub": str(user.id)})
    return TokenResponse(access_token=token, user=UserOut.model_validate(user))


@router.post("/login", response_model=TokenResponse)
async def login(
    payload: UserLogin,
    asession: AsyncSession = Depends(get_async_session),
):
    result = await asession.execute(select(UserDB).where(UserDB.email == payload.email))
    user = result.scalar_one_or_none()
    if not user or not user.hashed_password or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is deactivated")

    token = create_access_token({"sub": str(user.id)})
    return TokenResponse(access_token=token, user=UserOut.model_validate(user))


@router.post("/google", response_model=TokenResponse)
async def google_login(
    payload: GoogleAuthRequest,
    asession: AsyncSession = Depends(get_async_session),
):
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            "https://oauth2.googleapis.com/tokeninfo",
            params={"id_token": payload.credential},
        )

    if resp.status_code != 200:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Google token")

    info = resp.json()

    if Settings.GOOGLE_CLIENT_ID and info.get("aud") != Settings.GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Google token audience mismatch")

    google_id = info.get("sub")
    email = info.get("email")
    name = info.get("name", email)
    avatar_url = info.get("picture")

    if not email or not google_id:
        raise HTTPException(status_code=400, detail="Google token missing required fields")

    result = await asession.execute(select(UserDB).where(UserDB.google_id == google_id))
    user = result.scalar_one_or_none()
    if not user:
        result = await asession.execute(select(UserDB).where(UserDB.email == email))
        user = result.scalar_one_or_none()

    if user:
        if not user.google_id:
            user.google_id = google_id
        if avatar_url and not user.avatar_url:
            user.avatar_url = avatar_url
        await asession.commit()
        await asession.refresh(user)
    else:
        user = UserDB(name=name, email=email, google_id=google_id, avatar_url=avatar_url)
        asession.add(user)
        await asession.commit()
        await asession.refresh(user)

    token = create_access_token({"sub": str(user.id)})
    return TokenResponse(access_token=token, user=UserOut.model_validate(user))


@router.get("/me", response_model=UserOut)
async def get_me(
    current_user: UserDB = Depends(authenticate_user),
):
    return UserOut.model_validate(current_user)
