from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # --- Aplikacja ---
    APP_NAME: str = "Smart Task Platform"
    DEBUG: bool = False

    # --- Baza danych ---
    DATABASE_URL: str

    # --- Redis ---
    REDIS_URL: str = "redis://localhost:6379"

    # --- Bezpieczeństwo ---
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # --- OpenAI ---
    OPENAI_API_KEY: Optional[str] = None

    class Config:
        env_file = ".env"
        case_sensitive = False
    
settings = Settings()