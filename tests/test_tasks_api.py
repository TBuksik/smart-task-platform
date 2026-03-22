from httpx import AsyncClient
from tests.test_auth import get_auth_token

async def test_create_task(client: AsyncClient):
    token = await get_auth_token(client)

    headers = {"Authorization": f"Bearer {token}"}

    response = await client.post(
        "/api/v1/tasks/",
        headers=headers,
        json={
            "title": "Testowe zadanie",
            "description": "Opis zadania",
            "schedule": "codziennie o 8:00"
        }
    )

    assert response.status_code == 201

    data = response.json()
    assert data["title"] == "Testowe zadanie"
    assert data["status"] == "active"

    assert data["id"] is not None
    assert data["created_at"] is not None

