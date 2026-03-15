from celery import Celery
from app.core.config import settings

celery_app = Celery("smart_task_platform")

celery_app.config_from_object({
    "broker_url": settings.REDIS_URL,
    "result_backend": settings.REDIS_URL,
    "task_serializer": "json",
    "result_serializer": "json",
    "accept_content": ["json"],
    "timezone": "Europe/Warsaw",
    "enable_utc": True,
    "beat_schedule": {
        "check-pending-tasks": {
            "task": "app.workers.tasks.check_pending_tasks",
            "schedule": 60.0,
            "args": ()
        }
    }
})