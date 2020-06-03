"""Database."""
from bson.objectid import ObjectId
from bson.errors import InvalidId
from loguru import logger
from pymongo import MongoClient

import settings
import exceptions


class AfternoonTea:
    """Handle AfternoonTea."""

    def __init__(self, *, col: str, user):
        """Construct Mongo client."""
        self.collection = MongoClient(**settings.MONGODB)['afternoontea'][col]
        self.user = user

    def __repr__(self):
        """__repr__ method."""
        # TODO

    def get(self):
        """Get form."""
        data = None
        try:
            cur = self.collection.find({"user": self.user}, {"_id": 0})
            data = cur.next()
            return data
        except StopIteration:
            raise exceptions.NoAfternoonTeaFound(self.user)
        except InvalidId:
            raise exceptions.InvalidOidError(self.user)
        except Exception as err:
            logger.critical(err)  # TODO: handle unknown exceptions at a outer layer
            raise

    def upsert(self, *, data: dict):
        """Insert or update a doc."""
        data["user"] = self.user
        return self.collection.update({"user": self.user}, data, upsert=True)
