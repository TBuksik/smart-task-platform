from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict, List
from app.core.config import settings
from urllib.parse import unquote
import json
import redis.asyncio as aioredis
import logging

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/ws",
    tags=["websockets"]
)

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()

        self.active_connections.setdefault(user_id, [])
        self.active_connections[user_id].append(websocket)

    def disconnect(self, websocket: WebSocket, user_id: str):
        if user_id in self.active_connections:
            self.active_connections[user_id].remove(websocket)

            if not self.active_connections[user_id]:
                del self.active_connections[user_id]

    async def send_to_user(self, user_id: str, message: dict):
        if user_id in self.active_connections:
            for websocket in self.active_connections[user_id]:
                await websocket.send_text(json.dumps(message))

manager = ConnectionManager()

@router.websocket("/{user_id}")
async def websocked_endpoint(websocket: WebSocket, user_id: str):
    await manager.connect(websocket, user_id)
    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_text(f"Echo: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket, user_id)
        
        
@router.websocket("/tasks/{user_email}")
async def task_notifications(websocket: WebSocket, user_email: str):
    await websocket.accept()
    user_email = unquote(user_email)
    r = aioredis.from_url(settings.REDIS_URL)
    pubsub = r.pubsub()
    await pubsub.subscribe(f"task_completed:{user_email}")

    async for message in pubsub.listen():
        if message["type"] == "message":
            await websocket.send_text(message["data"].decode('utf-8'))