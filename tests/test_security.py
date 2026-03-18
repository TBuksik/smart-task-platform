import pytest
from app.core.security import hash_password, verify_password, create_access_token, decode_access_token

def test_hash_password_returns_different_string():
    password = "testpassword123"
    hashed = hash_password(password)
    assert hashed != password

def test_hash_password_is_not_deterministic():
    password = "testpassword123"
    hash1 = hash_password(password)
    hash2 = hash_password(password)
    assert hash1 != hash2

def test_verify_password_correct():
    password = "testpassword123"
    hashed = hash_password(password)
    assert verify_password(password, hashed) is True

def test_create_and_decode_token():
    email = "test@example.com"
    token = create_access_token(data={"sub": email})
    decoded_email = decode_access_token(token)
    assert decoded_email == email

def test_decode_invalid_token():
    result = decode_access_token("nieprawidlowy.token.jwt")
    assert result is None

