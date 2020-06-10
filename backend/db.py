"""Database."""
from typing import Union

from bson.errors import InvalidId
from loguru import logger
from pymongo import MongoClient
from redis import StrictRedis

import settings
import exceptions


class AfternoonTea:
    """Handle AfternoonTea."""

    def __init__(self, *, col: Union[str, None], user: str):
        """Construct Mongo client."""
        self.db = MongoClient(**settings.MONGODB)["afternoontea"]
        self.col = col
        self.user = user

    def __repr__(self):
        """__repr__ method."""
        return f"<Afternoon:{self.user}>"

    def get(self, *, return_default: bool = False):
        """Get form."""
        data = None
        try:
            data = self.db[self.col].find_one({"user": self.user}, {"_id": 0})
            if (data is None) and (return_default is True):
                data = self.db[self.col].find_one({"user": "default"}, {"_id": 0})
            if data:
                return data
            else:
                raise exceptions.NoAfternoonTeaFound(self.user)
        except InvalidId:
            raise exceptions.InvalidOidError(self.user)
        except Exception as err:
            logger.critical(err)  # TODO: handle unknown exceptions at a outer layer
            raise

    def upsert(self, *, data: dict):
        """Insert or update a doc."""
        data["user"] = self.user
        return self.db[self.col].update({"user": self.user}, data, upsert=True)

    def history(self):
        """Get order history."""
        collections = self.db.list_collection_names()
        for col in collections:
            doc = self.db[col].find_one({"user": self.user}, {"_id": 0})
            if not doc:
                break
            orders = []
            for form in doc["form"]:
                for item in form["items"]:
                    if item["value"] == 0:
                        continue
                    orders.append(
                        {
                            "item": item["itemLabel"],
                            "ice": item["selections"]["ice"],
                            "sugar": item["selections"]["sugar"],
                            "price": item["selections"]["size"],
                            "value": item["value"],
                            "size": {
                                j["price"]: j["selectionLabel"]
                                for j in [
                                    i
                                    for i in item["options"]
                                    if i["optionLabel"] == "Size"
                                ][0]["radioSelections"]
                            }[
                                item["selections"]["size"]
                            ],  # XXX: dirty and slow, should be optimized
                        }
                    )
            yield {"date": doc["expiration"], "orders": orders}


class AuthToken(dict):
    """Handle auth token."""

    def __init__(self):
        """Build reids connection."""
        self.conn = StrictRedis(**settings.REDIS)

    def __setitem__(self, token: str, user_data: str) -> None:
        """Cache token info."""
        res = self.conn.set(token, user_data)
        self.update_ttl(token)
        logger.debug(res)

    def __getitem__(self, token: str) -> Union[str, None]:
        """Retrieve user data."""
        if (payload := self.conn.get(token)) :
            self.update_ttl(token)
            return payload

    def __delitem__(self, token: str):
        """Delete a token."""
        self.conn.delete(token)

    def update_ttl(self, token: str):
        """Set or update TTL of a token."""
        self.conn.expire(token, settings.AUTH_TOKEN_TTL)
        logger.debug(f"Update TTL: {token}")
