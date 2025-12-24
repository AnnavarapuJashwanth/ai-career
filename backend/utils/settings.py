from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='backend/.env', env_file_encoding='utf-8', extra='ignore')

    MONGODB_URI: str = ''
    RAPIDAPI_KEY: str = ''
    GEMINI_API_KEY: str = ''
    ALLOWED_ORIGINS: str = 'http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174'
    JWT_SECRET: str = 'change-me'
    JWT_EXPIRE_MINUTES: int = 60 * 24

    @property
    def allowed_origins_list(self) -> List[str]:
        return [s.strip() for s in self.ALLOWED_ORIGINS.split(',') if s.strip()]

settings = Settings()