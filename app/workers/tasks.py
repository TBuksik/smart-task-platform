from os import name

from app.workers.celery_app import celery_app
from app.core.email import send_email
import logging
import asyncio

logger = logging.getLogger(__name__)

@celery_app.task(name="app.workers.tasks.check_pending_tasks")
def check_pending_tasks():
    logger.info("Sprawdzam zadania oczekujące...")
    return {"status": "ok", "checked": True}

@celery_app.task(name="app.workers.tasks.send_weekly_report")
def send_weekly_report(user_email: str):
    asyncio.get_event_loop().run_until_complete(send_email(
        [user_email],
        "Raport tygodniowy",
        f"<h1>Raport dla {user_email}</h1>"
    ))
    return {"status": "sent", "email": user_email}