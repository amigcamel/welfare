"""Database."""
from bson.objectid import ObjectId
from bson.errors import InvalidId
from loguru import logger
from pymongo import MongoClient

import settings
import exceptions


class AfternoonTea(dict):
    """Handle AfternoonTea."""

    def __init__(self):
        """Construct Mongo client."""
        self.client = MongoClient(**settings.MONGODB)

    def __repr__(self):
        """__repr__ method."""
        # TODO

    def __getitem__(self, oid: str):
        """Get latest form."""
        data = None
        try:
            cur = self.client.drink.items.find({"_id": ObjectId(oid)}, {"_id": 0})
            data = cur.next()
            return data
        except StopIteration:
            raise exceptions.NoAfternoonTeaFound(oid)
        except InvalidId:
            raise exceptions.InvalidOidError(oid)
        except Exception as err:
            logger.critical(err)  # TODO: handle unknown exceptions at a outer layer
            raise
