"""Websocket server."""
from urllib.parse import urlparse, parse_qs
import asyncio

from loguru import logger
import websockets

USERS = set()


def _validate_token(token):
    if token == "test":
        logger.info(f"Valid token: {token}")
        return True
    else:
        logger.info(f"Invalid token: {token}")
        return False


async def register(websocket):
    """Register a user."""
    USERS.add(websocket)
    logger.info(f"Connected user: {len(USERS)}")


async def unregister(websocket):
    """Unregister a user."""
    USERS.remove(websocket)
    logger.info(f"Connected user: {len(USERS)}")


async def notifier(websocket, path):
    """Notify clients what to do after receiving commands."""
    logger.debug(f"path: {path}")
    res = urlparse(path)
    if res.path == "/":
        if token := parse_qs(res.query).get("token"):
            if not _validate_token(token[0]):
                return
        else:
            logger.info("No token")
            return
    else:
        logger.info("Wrong path: {res.path}")
        return
    await register(websocket)

    try:
        async for message in websocket:
            if message == "update":
                logger.info(f"action: {message}")
                await asyncio.wait([user.send(message) for user in USERS])
            else:
                logger.error(f"Unknown action: {message}")

    finally:
        await unregister(websocket)


start_server = websockets.serve(notifier, "welfare.local.com", 6789)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
