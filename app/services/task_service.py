import math
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.task import Task
from app.schemas.task import TaskCreate, TaskStatus, TaskUpdate
from app.schemas.pagination import PaginationParams

from sqlalchemy import select
from typing import List, Optional

async def create_task(db: AsyncSession, task_data: TaskCreate) -> Task:
    db_task = Task(**task_data.model_dump())
    db.add(db_task)
    await db.commit()
    await db.refresh(db_task)
    return db_task

# ------------

async def get_task(db: AsyncSession, task_id: int) -> Optional[Task]:
    result = await db.execute(
        select(Task).where(Task.id == task_id)
    )
    return result.scalars().first()


async def get_tasks(db: AsyncSession) -> List[Task]:
    result = await db.execute(select(Task))
    return result.scalars().all()


async def get_tasks_paginated(
        db: AsyncSession,
        pagination: PaginationParams,
        status: Optional[TaskStatus] = None,
        search: Optional[str] = None
) -> dict:
    base_query = select(Task)
    count_query = select(func.count(Task.id))

    if status is not None:
        base_query = base_query.where(Task.status == status)
        count_query = count_query.where(Task.status == status)

    if search is not None:
        base_query = base_query.where(Task.title.ilike(f"%{search}%"))
        count_query = count_query.where(Task.title.ilike(f"%{search}%"))

    count_result = await db.execute(count_query)
    total = count_result.scalar()

    result = await db.execute(
        base_query
        .order_by(Task.id)
        .offset(pagination.offset)
        .limit(pagination.size)
    )
    tasks = result.scalars().all()

    pages = math.ceil(total / pagination.size) if total > 0 else 0

    return {
        "items": tasks,
        "total": total,
        "page": pagination.page,
        "size": pagination.size,
        "pages": pages
    }

# ------------

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

# ------------

async def delete_task(db: AsyncSession, task_id: int) -> bool:
    db_task = await get_task(db, task_id)

    if db_task is None:
        return False
    
    await db.delete(db_task)
    await db.commit()

    return True