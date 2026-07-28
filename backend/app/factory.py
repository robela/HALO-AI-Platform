from contextlib import asynccontextmanager
from typing import AsyncIterator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import Settings
from .middleware import RequestLoggingMiddleware


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    # startup: create all tables (dev convenience; use Alembic in prod)
    from .database import get_sqlalchemy_engine
    from .models import Base
    # import all feature models so Base knows about them
    from .auth import models as _auth_models  # noqa: F401
    from .contact import models as _contact_models  # noqa: F401
    from .speech import models as _speech_models  # noqa: F401
    from .sign import models as _sign_models  # noqa: F401

    try:
        Base.metadata.create_all(bind=get_sqlalchemy_engine())
    except Exception as e:
        import sys
        print(f"WARNING: Failed to create database tables: {e}", file=sys.stderr)

    # Load Whisper model once and store on app.state (optional, graceful fallback)
    try:
        from .speech.service import load_whisper_model
        app.state.whisper_model = load_whisper_model()
    except Exception as e:
        import sys
        print(f"WARNING: Whisper model not available: {e}", file=sys.stderr)
        app.state.whisper_model = None

    yield

    # shutdown: dispose engines
    from .database import _SYNC_ENGINE, _ASYNC_ENGINE
    if _SYNC_ENGINE is not None:
        _SYNC_ENGINE.dispose()
    if _ASYNC_ENGINE is not None:
        await _ASYNC_ENGINE.dispose()


def create_app() -> FastAPI:
    # Lazy imports keep non-server scripts (migrations, seeds) fast
    from .auth.routers import TAG_METADATA as AUTH_META, router as auth_router
    from .contact.routers import TAG_METADATA as CONTACT_META, router as contact_router
    from .speech.routers import TAG_METADATA as SPEECH_META, router as speech_router
    from .sign.routers import TAG_METADATA as SIGN_META, router as sign_router

    app = FastAPI(
        title="HALO AI Platform API",
        description="Voice Intelligence for Africa",
        version="1.0.0",
        lifespan=lifespan,
        openapi_tags=[AUTH_META, CONTACT_META, SPEECH_META, SIGN_META],
    )

    # RequestLoggingMiddleware first (outermost wrapper)
    app.add_middleware(RequestLoggingMiddleware)

    app.include_router(auth_router)
    app.include_router(contact_router)
    app.include_router(speech_router)
    app.include_router(sign_router)

    # Build CORS allowed origins
    allowed_origins = [
        "*",  # Allow all origins for now to debug CORS issues
    ]

    # CORSMiddleware last (innermost wrapper = applied first to requests)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/health", tags=["Health"])
    async def health():
        return {"status": "ok", "service": "HALO AI Platform API"}

    return app
