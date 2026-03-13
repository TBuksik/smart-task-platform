from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from datetime import datetime, timezone

from app.core.database import get_db
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse, TaskStatus
from app.services import task_service

router = APIRouter(
    prefix="/tasks",
    tags=["tasks"],
)

@router.get(
    "/",
    response_model=List[TaskResponse],
    status_code=status.HTTP_200_OK,
    summary="Pobierz wszystkie zadania",
)
async def get_tasks():
    return fake_db

@router.get(
    "/{task_id}",
    response_model=TaskResponse,
    status_code=status.HTTP_200_OK,
    summary="Pobierz zadanie po ID",
)
async def get_task(task_id: int):
    task = next(
        (t for t in fake_db if t["id"] == task_id),
        None
    )

    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Zadanie o id {task_id} nie istnieje"
        )
    
    return task

@router.post(
    "/",
    response_model=TaskResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Stwórz nowe zadanie",
)
async def create_task(task_data: TaskCreate):
    global next_id

    now = datetime.now(timezone.utc)

    new_task = {
        **task_data.model_dump(),
        "id": next_id,
        "created_at": now,
        "updated_at": None,
    }

    fake_db.append(new_task)
    next_id += 1

    return new_task

@router.put(
    "/{task_id}",
    response_model=TaskResponse,
    status_code=status.HTTP_200_OK,
    summary="Zaktualizuj zadanie",
)
async def update_task(task_id: int, task_data: TaskUpdate):
    task_index = next(
        (i for i, t in enumerate(fake_db) if t["id"] == task_id),
        None
    )

    if task_index is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Zadanie o ID {task_id} nie istnieje"
        )
    
    update_data = task_data.model_dump(exclude_unset=True)

    fake_db[task_index].update(update_data)
    fake_db[task_index]["updated_at"] = datetime.now(timezone.utc)

    return fake_db[task_index]

@router.delete(
    "/{task_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Usuń zadanie",
)
async def delete_task(task_id: int):
    task_index = next(
        (i for i, t in enumerate(fake_db) if t["id"] == task_id),
    )

    if task_index is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Zadanie o ID {task_id} nie istnieje"
        )
    
    fake_db.pop(task_index)