import asyncio
import websockets

async def test():
    uri = "ws://localhost:8000/ws/user123"
    async with websockets.connect(uri) as ws:
        await ws.send("Hej!")
        response = await ws.recv()
        print(f"Odpowiedź: {response}")

asyncio.run(test())