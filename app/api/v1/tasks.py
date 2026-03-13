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
async def get_tasks(db: AsyncSession = Depends(get_db)):
    return await task_service.get_tasks(db)

@router.get(
    "/{task_id}",
    response_model=TaskResponse,
    status_code=status.HTTP_200_OK,
    summary="Pobierz zadanie po ID",
)
async def get_task(task_id: int, db: AsyncSession = Depends(get_db)):
    result =  await task_service.get_task(db, task_id)

    if result is None:
        raise HTTPException(status_code=404, detail="Task not found.")
    
    return result

@router.post(
    "/",
    response_model=TaskResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Stwórz nowe zadanie",
)
async def create_task(task_data: TaskCreate, db: AsyncSession = Depends(get_db)):
    return await task_service.create_task(db, task_data)
    
@router.put(
    "/{task_id}",
    response_model=TaskResponse,
    status_code=status.HTTP_200_OK,
    summary="Zaktualizuj zadanie",
)
async def update_task(task_id: int, task_data: TaskUpdate, db: AsyncSession = Depends(get_db)):
    result = await task_service.update_task(db, task_id, task_data)

    if result is None:
        raise HTTPException(status_code=404, detail="Task not found.")

    return result

@router.delete(
    "/{task_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Usuń zadanie",
)
async def delete_task(task_id: int, db):
    result = await task_service.delete_task(db, task_id)

    if result is False:
        raise HTTPException(status_code=404, detail="Task not found.")