from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional

from app.models.user import User
from app.schemas.user import UserCreate
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