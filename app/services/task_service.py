from sqlalchemy.ext.asyncio import AsyncSession
from app.models.task import Task
from app.schemas.task import TaskCreate

from sqlalchemy import select
from typing import Optional

async def create_task(db: AsyncSession, task_data: TaskCreate) -> Task:
    db_task = Task(**task_data.model_dump())
    db.add(db_task)
    await db.commit()
    await db.refresh(db_task)
    return db_task

async def get_task(db: AsyncSession, task_id: int) -> Optional[Task]:
    result = await db.execute(
        select(Task).where(Task.id == task_id)
    )
    return result.scalars().first()