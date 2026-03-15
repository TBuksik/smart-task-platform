from os import name

from app.workers.celery_app import celery_app
import logging

logger = logging.getLogger(__name__)

@celery_app.task(name="app.workers.tasks.check_pending_tasks")
def check_pending_tasks():
    logger.info("Sprawdzam zadania oczekujące...")
    return {"status": "ok", "checked": True}

