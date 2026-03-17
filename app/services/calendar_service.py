from googleapiclient.discovery import build
from google.oauth2 import service_account
from datetime import datetime, timezone
from typing import List

from app.core.config import settings

SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"]

def get_calendar_service():
    credentials = service_account.Credentials.from_service_account_file(
        settings.GOOGLE_CREDENTIALS_FILE,
        scopes=SCOPES
    )

    service = build("calendar", "v3", credentials=credentials)

    return service

def get_weekly_events() -> List[dict]:
    service = get_calendar_service()

    now = datetime.now(timezone.utc)

    time_min = now.isoformat()

    from datetime import timedelta
    time_max = (now + timedelta(days=7)).isoformat()

    events_result = service.events().list(
        calendarId=settings.GOOGLE_CALENDAR_ID,
        timeMin=time_min,
        timeMax=time_max,
        maxResults=50,
        singleEvents=True,
        orderBy="startTime"
    ).execute()

    events = events_result.get("items", [])

    result = []
    for event in events:
        result.append({
            "title": event.get("summary", "Bez tytułu"),
            "start": event["start"].get("dateTime", event["start"].get("date")),
            "end": event["end"].get("dateTime", event["end"].get("date"))
        })

    return result

