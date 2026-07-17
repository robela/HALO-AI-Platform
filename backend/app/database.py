from collections.abc import AsyncGenerator, Generator

from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import Session

from .config import Settings

_SYNC_ENGINE = None
_ASYNC_ENGINE = None


def _sync_url() -> str:
    url = Settings.DATABASE_URL
    # sqlite async uses aiosqlite driver; sync keeps the default
    return url


def _async_url() -> str:
    url = Settings.DATABASE_URL
    # Convert sqlite:/// → sqlite+aiosqlite:/// for async driver
    if url.startswith("sqlite:///"):
        return url.replace("sqlite:///", "sqlite+aiosqlite:///", 1)
    # Convert postgresql+psycopg2 → postgresql+asyncpg for async
    if url.startswith("postgresql+psycopg2://"):
        return url.replace("postgresql+psycopg2://", "postgresql+asyncpg://", 1)
    if url.startswith("postgresql://"):
        return url.replace("postgresql://", "postgresql+asyncpg://", 1)
    return url


def get_sqlalchemy_engine():
    global _SYNC_ENGINE
    if _SYNC_ENGINE is None:
        kwargs = {}
        if Settings.DATABASE_URL.startswith("sqlite"):
            kwargs["connect_args"] = {"check_same_thread": False}
        else:
            kwargs["pool_size"] = Settings.DB_POOL_SIZE
            kwargs["pool_timeout"] = 300
        _SYNC_ENGINE = create_engine(_sync_url(), **kwargs)
    return _SYNC_ENGINE


def get_sqlalchemy_async_engine():
    global _ASYNC_ENGINE
    if _ASYNC_ENGINE is None:
        kwargs = {}
        if not Settings.DATABASE_URL.startswith("sqlite"):
            kwargs["pool_size"] = Settings.DB_POOL_SIZE
            kwargs["pool_timeout"] = 300
        _ASYNC_ENGINE = create_async_engine(_async_url(), **kwargs)
    return _ASYNC_ENGINE


def get_session() -> Generator[Session, None, None]:
    with Session(get_sqlalchemy_engine(), expire_on_commit=False) as session:
        yield session


async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSession(get_sqlalchemy_async_engine(), expire_on_commit=False) as session:
        yield session
