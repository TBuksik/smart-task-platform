import pytest
from fastapi.testclient import TestClient
from app.core.security import create_access_token


def test_websocket_connect(sync_client):
    token = create_access_token(data={"sub": "test@example.com"})
    with sync_client.websocket_connect(f"/api/v1/ws/tasks/test@example.com?token={token}") as ws:
        assert ws is not None


def test_websocket_receives_message(sync_client):
    token = create_access_token(data={"sub": "test@example.com"})
    with sync_client.websocket_connect(f"/api/v1/ws/tasks/test@example.com?token={token}") as ws:
        import redis
        from app.core.config import settings
        import json
        r = redis.from_url(settings.REDIS_URL)
        r.publish("task_completed:test@example.com", json.dumps({"status": "completed"}).encode('utf-8'))
        data = ws.receive_text()
        assert "completed" in data