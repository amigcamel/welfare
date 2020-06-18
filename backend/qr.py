"""QR Code."""
from cryptography.fernet import Fernet
from loguru import logger
import re

import settings


class QR:
    """Handle QR code."""

    def __init__(self):
        """Construct Fernet key."""
        self.fernet = Fernet(settings.QR_SECRET.encode("utf-8"))

    @classmethod
    def encrypt(cls, text: str):
        """Encrypt afternoontea hash."""
        max_len = 100
        if len(text) > max_len:
            errmsg = f"text length cannot over {max_len}"
            logger.critical(errmsg)
            raise ValueError(errmsg)
        if not re.search(r"[^|]+?\|[^|]+?\|[^|]", text):
            errmsg = f"Invalid pattern: {text}"
            logger.error(errmsg)
            raise ValueError(errmsg)
        return cls().fernet.encrypt(text.ljust(max_len).encode("utf-8")).decode("utf-8")

    @classmethod
    def decrypt(cls, token: str) -> (str, str, str):
        """Decrypt afternoontea hash."""
        dbname, col, user = (
            cls()
            .fernet.decrypt(token.encode("utf-8"))
            .decode("utf-8")
            .strip()
            .split("|")
        )
        return dbname, col, user
