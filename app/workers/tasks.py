from app.workers.celery_app import celery_app
from app.core.email import send_email
from app.core.config import settings
from app.services.calendar_service import get_weekly_events
import logging
import asyncio
import redis as redis_client
import json

logger = logging.getLogger(__name__)

@celery_app.task(name="app.workers.tasks.check_pending_tasks")
def check_pending_tasks():
    logger.info("Sprawdzam zadania oczekujące...")
    logger.info(f"REDIS_URL: {settings.REDIS_URL}")
    r = redis_client.from_url(settings.REDIS_URL)

    channel = "task_completed:test"

    r.publish(channel, json.dumps({
        "status": "completed",
    }))

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

    r = redis_client.from_url(settings.REDIS_URL)

    channel = f"task_completed:{user_email}"

    r.publish(channel, json.dumps({
        "status": "completed",
        "email": user_email,
        "events_count": len(events)
    }))

    return {"status": "sent", "email": user_email}