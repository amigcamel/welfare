"""Websocket server."""
from urllib.parse import urlparse, parse_qs
import asyncio

from loguru import logger
import requests
import websockets

USERS = set()


def _validate_token(token):
    headers = {"Authorization": f"Bearer {token}"}
    resp = requests.get(
        "http://backend:5000/api/token_info", headers=headers
    )  # TODO: Add timeout
    if resp.status_code == 200:
        user_info = resp.json()
        if user_info.get("level") == 300:  # TODO: DRY
            logger.info(f"is admin: {user_info['email']}")
            return True
        else:
            logger.info(f"is Not admin: {user_info['email']}")
            return False
    elif resp.status_code == 401:
        logger.info(resp.json())
        return False
    else:
        pass  # TODO: add handling


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
