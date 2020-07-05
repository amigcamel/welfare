"""Client."""
import asyncio
import websockets


async def hello():
    """Hello."""
    uri = "ws://welfare.local.com:6789/?token=test"
    async with websockets.connect(uri) as websocket:
        action = input("Action: ")

        await websocket.send(action)
        print(f"> {action}")

        response = await websocket.recv()
        print(f"< {response}")


asyncio.get_event_loop().run_until_complete(hello())
