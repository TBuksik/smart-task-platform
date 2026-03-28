import asyncio
import websockets

async def test():
    uri = "ws://localhost:8000/ws/tasks/user@example.com"
    async with websockets.connect(uri) as ws:
        print("Połączono - czekam na powiadomienie...")
        response = await ws.recv()
        print(f"Odpowiedź: {response}")

asyncio.run(test())