from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import api_router
from app.core.config import settings


def create_app() -> FastAPI:
	app = FastAPI(
		title="Oryntal AI API",
		description="AI-powered platform for social sentiment and market insights",
		version="0.1.0",
	)

	# CORS
	app.add_middleware(
		CORSMiddleware,
		allow_origins=settings.cors_allow_origins,
		allow_credentials=True,
		allow_methods=["*"],
		allow_headers=["*"],
	)

	# Routes
	app.include_router(api_router)

	@app.get("/health")
	def health() -> dict:
		return {"status": "ok"}

	return app


app = create_app()


