from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional

from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import hash_password, verify_password

async def get_user_by_email(db: AsyncSession, email: str) -> Optional[User]:
    result = await db.execute(
        select(User).where(User.email == email)
    )
    return result.scalars().first()

async def create_user(db: AsyncSession, user_data: UserCreate) -> User:
    new_user = User(
        full_name = user_data.full_name,
        email = user_data.email,
        hashed_password = hash_password(user_data.password),
    )

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    return new_user

async def authenticate_user(db: AsyncSession, email: str, password: str) -> Optional[User]:
    user = await get_user_by_email(db, email)

    if user is None:
        return None
    
    if not verify_password(password, user.hashed_password):
        return None
    
    return user

async def update_user(db: AsyncSession, user: User, user_data: UserUpdate) -> User:
    if user_data.full_name is not None:
        user.full_name = user_data.full_name

    await db.commit()
    await db.refresh(user)

    return user