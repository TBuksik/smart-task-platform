from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Text, Enum as SQLEnum, func
from datetime import datetime
from typing import Optional

from app.core.database import Base
from app.schemas.task import TaskStatus

class Task(Base):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True
    )

    title: Mapped[str] = mapped_column(
        String(200),
        nullable=False
    )

    description: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True
    )

    schedule: Mapped[Optional[str]] = mapped_column(
        String(500),
        nullable=True
    )

    status: Mapped[str] = mapped_column(
        SQLEnum(TaskStatus, name="taskstatus"),
        default=TaskStatus.ACTIVE,
        nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        nullable=False,
        server_default=func.now()
    )

    updated_at: Mapped[Optional[datetime]] = mapped_column(
        nullable=True,
        onupdate=func.now()
    )

    def __repr__(self) -> str:
        return f"<Task id={self.id} title={self.title}"