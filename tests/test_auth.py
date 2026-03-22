import pytest
from httpx import AsyncClient

async def test_register_user(client: AsyncClient):
    response = await client.post(
        "/api/v1/auth/register",
        json={
            "email": "test@example.com",
            "password": "testpassword123",
            "full_name": "Test User"
        }
    )

    assert response.status_code == 201

    data = response.json()

    assert data["email"] == "test@example.com"
    assert data["full_name"] == "Test User"

    assert "password" not in data
    assert "hashed_password" not in data

async def test_register_user_duplicate_email(client: AsyncClient):
    response = await client.post(
        "/api/v1/auth/register",
        json={
            "email": "duplicate@example.com",
            "password": "testpassword123",
            "full_name": "Duplicate User"
        }
    )

    response2 = await client.post(
        "/api/v1/auth/register",
        json={
            "email": "duplicate@example.com",
            "password": "testpassword123",
            "full_name": "Duplicate User 2"
        }
    )

    assert response2.status_code == 400

    assert response2.json()["detail"] != ""
