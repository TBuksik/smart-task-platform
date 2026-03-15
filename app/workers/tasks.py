from os import name

from app.workers.celery_app import celery_app
import logging

logger = logging.getLogger(__name__)

@celery_app.task(name="app.workers.tasks.check_pending_tasks")
def check_pending_tasks():
    logger.info("Sprawdzam zadania oczekujące...")
    return {"status": "ok", "checked": True}

@celery_app.task(name="app.workers.tasks.send_weekly_report")
def send_weekly_report(user_email: str):
    logger.info(f"Wysyłam raport tygodniowy do {user_email}")
    return {"status": "sent", "email": user_email}