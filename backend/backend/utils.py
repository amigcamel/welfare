"""Utilities."""
import websocket


def send_action(action: str, token: str):
    """Send action message via websocket client."""
    ws = websocket.WebSocket()
    ws.connect(f"ws://websocket:6789/?token={token}")
    ws.send(action)
    ws.close(reason=b"finish sending action ({action})")
