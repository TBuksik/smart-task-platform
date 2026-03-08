from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum

class TaskStatus(str, Enum):
    ACTIVE = "active"
    PAUSED = "paused"
    COMPLETED = "completed"

class TaskBase(BaseModel):
    title: str = Field(
        ...,
        min_length=1,
        max_length=200,
        description="Nazwa zadania"
    )
    description: Optional[str] = Field(
        None,
        max_length=1000,
        description="Opis zadania"
    )
    schedule: Optional[str] = Field(
        None,
        description="Harmonogram w języku naturalnym, np. 'codziennie o 8:00'"
    )
    status: TaskStatus = Field(
        default=TaskStatus.ACTIVE,
        description="Status zadania"
    )

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    schedule: Optional[str] = None
    status: Optional[TaskStatus] = None

class TaskResponse(TaskBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}