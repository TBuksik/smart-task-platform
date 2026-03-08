from fastapi import FastAPI
from app.core.config import settings
from app.api.v1 import tasks

app = FastAPI(
    title=settings.APP_NAME,
    version="0.1.0",
    description="Platforma automatyzji zadań z AI",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.include_router(
    tasks.router,
    prefix="/api/v1"
)

@app.get("/")
async def root():
    return {
        "message": f"Witaj w {settings.APP_NAME}",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "app": settings.APP_NAME
    }