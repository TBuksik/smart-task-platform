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

async def test_get_tasks(client: AsyncClient):
    token = await get_auth_token(client)

    headers = {"Authorization": f"Bearer {token}"}

    response_create = await client.post(
        "/api/v1/tasks/",
        headers=headers,
        json={
            "title": "Testowe zadanie",
            "description": "Opis zadania",
            "schedule": "codziennie o 8:00"
        }
    )

    response_get = await client.get(
        "/api/v1/tasks/",
        headers=headers
    )

    assert response_get.status_code == 200
    assert isinstance(response_get.json(), list)
    assert len(response_get.json()) >= 1

async def test_get_task_not_found(client: AsyncClient):
    token = await get_auth_token(client)

    headers = {"Authorization": f"Bearer {token}"}

    response = await client.get(
        "/api/v1/tasks/99999",
        headers=headers
    )

    assert response.status_code == 404