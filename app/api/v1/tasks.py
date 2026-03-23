from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from datetime import datetime, timezone

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.schemas.pagination import PagedResponse, PaginationParams
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse, TaskStatus
from app.services import task_service
from app.services.ai_service import parse_schedule_rule
from app.models.user import User
from app.workers.tasks import send_weekly_report
from app.workers.celery_app import celery_app
from celery.result import AsyncResult

router = APIRouter(
    prefix="/tasks",
    tags=["tasks"],
)

# ----------

@router.get(
    "/",
    response_model=PagedResponse[TaskResponse],
    status_code=status.HTTP_200_OK,
    summary="Pobierz wszystkie zadania",
)
async def get_tasks(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user), page: int = 1, size: int = 10):
    pagination = PaginationParams(page=page, size=size)
    return await task_service.get_tasks_paginated(db, pagination)

@router.get(
    "/{task_id}",
    response_model=TaskResponse,
    status_code=status.HTTP_200_OK,
    summary="Pobierz zadanie po ID",
)
async def get_task(task_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result =  await task_service.get_task(db, task_id)

    if result is None:
        raise HTTPException(status_code=404, detail="Task not found.")
    
    return result

@router.get(
    "/{task_id}/parse-schedule",
    status_code=status.HTTP_200_OK,
    summary="Zamień harmonogram z nl na cron"
)
async def parse_schedule(task_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_task = await task_service.get_task(db, task_id)

    if db_task is None:
        raise HTTPException(404, detail="Nie znaleziono zadania")

    if db_task.schedule is None:
        raise HTTPException(400, detail="Zadanie nie ma harmonogramu")

    ai_result = await parse_schedule_rule(db_task.schedule)
    
    return {
        "task_id": task_id,
        "schedule_text": db_task.schedule,
        "parsed": ai_result
    }

@router.get(
    "/{task_id}/status/{celery_task_id}",
    status_code=status.HTTP_200_OK,
    summary="Pobierz status zadania"
)
async def get_task_status(task_id: int, celery_task_id: str, current_user: User = Depends(get_current_user)):
    celery_result = AsyncResult(celery_task_id, app=celery_app)
    return {
        "celery_task_id": celery_task_id,
        "status": celery_result.status,
        "result": celery_result.result
    }

# -----------

@router.post(
    "/",
    response_model=TaskResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Stwórz nowe zadanie",
)
async def create_task(task_data: TaskCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    return await task_service.create_task(db, task_data)
    

@router.post(
    "/{task_id}/run",
    status_code=status.HTTP_202_ACCEPTED,
    summary="Uruchom zadanie asynchroniczne",
)
async def run_task(
    task_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_task = await task_service.get_task(db, task_id)

    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found.")

    celery_task = send_weekly_report.delay(current_user.email)

    return {
        "message": "Zadanie zostało zlecone",
        "celery_task_id": celery_task.id,
        "task_id": task_id
    }
# ----------

@router.put(
    "/{task_id}",
    response_model=TaskResponse,
    status_code=status.HTTP_200_OK,
    summary="Zaktualizuj zadanie",
)
async def update_task(task_id: int, task_data: TaskUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await task_service.update_task(db, task_id, task_data)

    if result is None:
        raise HTTPException(status_code=404, detail="Task not found.")

    return result

# -----------

@router.delete(
    "/{task_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Usuń zadanie",
)
async def delete_task(task_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await task_service.delete_task(db, task_id)

    if result is False:
        raise HTTPException(status_code=404, detail="Task not found.")