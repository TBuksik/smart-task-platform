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

    # --- Email ---
    MAIL_USERNAME: str = ""
    MAIL_PASSWORD: str = ""
    MAIL_FROM: str = "noreply@smarttaskplatform.com"
    MAIL_PORT: int = 587
    MAIL_SERVER: str = "sandbox.smtp.mailtrap.io"

    # --- Gooogle Calendar ---
    GOOGLE_CALENDAR_ID: str = ""
    GOOGLE_CREDENTIALS_FILE: str = "google_credentials.json"

    # --- Google OAuth2 ---
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    GOOGLE_REDIRECT_URI: str = "http://localhost:8000/api/v1/auth/google/callback"

    class Config:
        env_file = ".env"
        case_sensitive = False
    
settings = Settings()