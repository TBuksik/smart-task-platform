from openai import AsyncOpenAI
from app.core.config import settings

client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

async def parse_schedule_rule(rule: str) -> dict:
    system_prompt = """Jesteś ekspertem od harmonogramów i wyrażeń cron.
    Twoim zadaniem jest zamiana opisu harmonogramu w języku naturalnym na wyrażenie cron.
    
    Odpowiedz TYLKO w formacie JSON, bez żadnego dodatkowego tekstu:
    {
        "cron": "wyrażenie cron",
        "description: "czytelny opis po polsku"
    }

    Wyrażenie cron ma format: minuta godzina dzień_miesiąca miesiąc dzień_tygodnia
    Przykłady:
    - "codziennie o 8:00" -> "0 8 * * *"
    - w piątek o 17:00" -> "0 17 * * 5"
    - "pierwszego każdego miesiąca o 9:00" -> "0 9 1 * *"
    """

    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Harmonogram: {rule}"}
        ],
        max_tokens=100,
        temperature=0.1,
    )

    content = response.choices[0].message.content

    import json
    result = json.loads(content)

    return result