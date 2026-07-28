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

    Base.metadata.create_all(bind=get_sqlalchemy_engine())

    # Load Whisper model once and store on app.state
    from .speech.service import load_whisper_model
    app.state.whisper_model = load_whisper_model()

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
        Settings.FRONTEND_URL,
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:5173",
        "https://halo-africa-site-397980615504.us-central1.run.app",
        "https://halo-africa-site-staging-main-presence-500410-f8.us-central1.run.app",
        "https://api.haloafrica.ai",
        "https://staging-api.haloafrica.ai",
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
