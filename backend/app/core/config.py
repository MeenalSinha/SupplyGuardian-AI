"""Application configuration via environment variables."""

from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # App
    APP_NAME: str = "SupplyGuardian AI"
    APP_ENV: str = "development"
    DEBUG: bool = True
    SECRET_KEY: str = "supplyguardian-secret-change-in-production-xyz789"
    API_V1_STR: str = "/api/v1"

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://supplyguardian:supplyguardian@localhost:5432/supplyguardian"
    DATABASE_POOL_SIZE: int = 10
    DATABASE_MAX_OVERFLOW: int = 20

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # OpenAI
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4o"
    OPENAI_EMBEDDING_MODEL: str = "text-embedding-3-small"

    # Anthropic (fallback)
    ANTHROPIC_API_KEY: str = ""

    # JWT
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    ALGORITHM: str = "HS256"

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://supplyguardian.ai",
    ]

    # Storage (S3-compatible)
    STORAGE_ENDPOINT: str = ""
    STORAGE_ACCESS_KEY: str = ""
    STORAGE_SECRET_KEY: str = ""
    STORAGE_BUCKET: str = "supplyguardian"

    # External APIs
    OFAC_API_KEY: str = ""
    NEWS_API_KEY: str = ""
    WEATHER_API_KEY: str = ""

    # Observability
    OTEL_EXPORTER_OTLP_ENDPOINT: str = "http://localhost:4317"
    LANGFUSE_PUBLIC_KEY: str = ""
    LANGFUSE_SECRET_KEY: str = ""

    # UiPath
    UIPATH_CLIENT_ID: str = ""
    UIPATH_CLIENT_SECRET: str = ""
    UIPATH_TENANT_URL: str = ""


settings = Settings()
