from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.requests import Request
from starlette.responses import RedirectResponse

from app.core.database import get_db
from app.core.security import create_access_token
from app.core.oauth import oauth
from app.core.config import settings
from app.schemas.user import UserCreate, UserResponse, UserLogin
from app.services import user_service

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

@router.post(
    "/login",
    status_code=status.HTTP_200_OK
)
async def login(
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
    return {"access_token": token, "token_type": "bearer"}

# ---------

@router.get("/google/login")
async def google_login(request: Request):
    redirect_uri = settings.GOOGLE_REDIRECT_URI

    return await oauth.google.authorize_redirect(request, redirect_uri)