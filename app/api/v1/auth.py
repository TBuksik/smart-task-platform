import secrets
from fastapi import APIRouter, HTTPException, Depends, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from slowapi import Limiter
from slowapi.util import get_remote_address
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.requests import Request
from starlette.responses import RedirectResponse

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.core.security import create_access_token, create_refresh_token, decode_refresh_token
from app.core.oauth import oauth
from app.core.config import settings
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse, UserLogin, RefreshTokenRequest, UserUpdate
from app.services import user_service
from app.schemas.user import UserCreate

limiter = Limiter(key_func=get_remote_address)

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)

@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED
)
async def register(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    existing_user = await user_service.get_user_by_email(db, user_data.email)

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Użytkownik z tym emailem już istnieje"
        )
    
    return await user_service.create_user(db, user_data)


@router.post("/login",status_code=status.HTTP_200_OK)
@limiter.limit("5/minute")
async def login(
    request: Request,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    user = await user_service.authenticate_user(
        db,
        form_data.username,
        form_data.password
    )

    if user is None:
        raise HTTPException(status_code=401, detail="Nieprawidłowy email lub hasło")

    token = create_access_token(data={"sub": user.email})
    refresh_token = create_refresh_token(data={"sub": user.email})
    return {"access_token": token, "refresh_token": refresh_token, "token_type": "bearer"}


@router.post("/refresh", status_code=status.HTTP_200_OK)
async def refresh(data: RefreshTokenRequest):
    email = decode_refresh_token(data.refresh_token)

    if email is None:
        raise HTTPException(status_code=401, detail="Nieprawidłowy refresh token")

    new_access_token = create_access_token(data={"sub": email})
    return {"access_token": new_access_token, "token_type": "bearer"}

# ---------

@router.get("/google/login")
async def google_login(request: Request):
    redirect_uri = settings.GOOGLE_REDIRECT_URI

    return await oauth.google.authorize_redirect(request, redirect_uri)


@router.get("/google/callback")
async def google_callback(request: Request, db: AsyncSession = Depends(get_db)):
    token = await oauth.google.authorize_access_token(request)
    userinfo = token.get("userinfo")

    user = await user_service.get_user_by_email(db, userinfo["email"])

    if user is None:
        user_data = UserCreate(
            email=userinfo["email"],
            password=secrets.token_urlsafe(32),
            full_name=userinfo.get("name")
        )
        user = await user_service.create_user(db, user_data)
    
    jwt_token = create_access_token(data={"sub": user.email})
    return {"access_token": jwt_token, "token_type": "bearer"}


@router.get("/me", response_model=UserResponse, status_code=status.HTTP_200_OK)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user

# ---------

@router.patch("/me", response_model=UserResponse, status_code=status.HTTP_200_OK)
async def update_me(
    user_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await user_service.update_user(db, current_user, user_data)

