import os
from pydantic_settings import BaseSettings, SettingsConfigDict


class BackendSettings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=os.getenv("BACKEND_ENV_FILE", ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # Database
    DATABASE_URL: str = "sqlite:///./halo_ai.db"
    DB_POOL_SIZE: int = 5

    # JWT
    JWT_SECRET_KEY: str = "dev-secret-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080

    # CORS - Support multiple origins separated by comma
    FRONTEND_URL: str = "http://localhost:5173"
    ALLOWED_ORIGINS: str = "http://localhost:5173,http://localhost:3000"  # Comma-separated list

    # Google OAuth
    GOOGLE_CLIENT_ID: str = ""

    # Logging
    LOG_LEVEL: str = "INFO"


Settings = BackendSettings()

