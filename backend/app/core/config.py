from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    api_v1_prefix: str = ""

    # CORS
    cors_allow_origins: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ]

    # Database and cache
    database_url: str
    redis_url: str

    # API Keys
    alpha_vantage_api_key: str
    financial_modeling_prep_api_key: str
    coingecko_api_key: str
    twitter_bearer_token: str
    fmp_api_key: str

    # Email Configuration
    email_host: str
    email_port: int
    email_host_user: str
    email_host_password: str
    email_use_tls: bool = True

    # JWT Settings
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()
