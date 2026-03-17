from os import name

from app.workers.celery_app import celery_app
from app.core.email import send_email
from app.services.calendar_service import get_weekly_events
import logging
import asyncio

logger = logging.getLogger(__name__)

@celery_app.task(name="app.workers.tasks.check_pending_tasks")
def check_pending_tasks():
    logger.info("Sprawdzam zadania oczekujące...")
    return {"status": "ok", "checked": True}

@celery_app.task(name="app.workers.tasks.send_weekly_report")
def send_weekly_report(user_email: str):
    events = get_weekly_events()

    events_html = ""
    for event in events:
        events_html += f"<p>{event['title']} - {event['start']}</p>"

    asyncio.get_event_loop().run_until_complete(send_email(
        [user_email],
        "Raport tygodniowy",
        events_html
    ))
    
    return {"status": "sent", "email": user_email}