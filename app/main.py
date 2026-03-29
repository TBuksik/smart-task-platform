from fastapi import FastAPI
from app.core.config import settings
from app.api.v1 import tasks, auth
from app.api.v1 import websockets

from prometheus_fastapi_instrumentator import Instrumentator
from starlette.middleware.sessions import SessionMiddleware

app = FastAPI(
    title=settings.APP_NAME,
    version="0.1.0",
    description="Platforma automatyzji zadań z AI",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.include_router(tasks.router, prefix="/api/v1")
app.include_router(auth.router, prefix="/api/v1")
app.include_router(websockets.router, prefix="/api/v1")

app.add_middleware(
    SessionMiddleware,
    secret_key=settings.SECRET_KEY
)

Instrumentator().instrument(app).expose(app)

@app.get("/")
async def root():
    return {
        "message": f"Witaj w {settings.APP_NAME}",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "app": settings.APP_NAME}