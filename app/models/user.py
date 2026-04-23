from typing import Optional

from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Boolean, func
from datetime import datetime

from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True
    )

    full_name: Mapped[Optional[str]] = mapped_column(
        String(100)
    )

    email: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        unique=True
    )

    hashed_password: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean(),
        default=True,
        nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        nullable=False,
        server_default=func.now()
    )

    avatar_url: Mapped[Optional[str]] = mapped_column(
        String(500),
        nullable=True
    )

    def __repr__(self) -> str:
        return f"<User id={self.id} email={self.email}>"