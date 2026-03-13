from sqlalchemy.ext.asyncio import AsyncSession
from app.models.task import Task
from app.schemas.task import TaskCreate, TaskStatus, TaskUpdate

from sqlalchemy import select
from typing import List, Optional

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

async def get_tasks(db: AsyncSession) -> List[Task]:
    result = await db.execute(select(Task))
    return result.scalars().all()

async def update_task(
        db: AsyncSession,
        task_id: int,
        task_data: TaskUpdate
) -> Optional[Task]:
    db_task = await get_task(db, task_id)

    if db_task is None:
        return None
    
    update_data = task_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(db_task, field, value)

    await db.commit()
    await db.refresh(db_task)
    return db_task

async def delete_task(db: AsyncSession, task_id: int) -> bool:
    db_task = await get_task(db, task_id)

    if db_task is None:
        return False
    
    await db.delete(db_task)
    await db.commit()

    return True