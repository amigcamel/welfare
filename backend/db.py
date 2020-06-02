"""Database."""
from bson.objectid import ObjectId
from pymongo import MongoClient

import settings


class AfternoonTea(dict):
    """Handle AfternoonTea."""

    def __init__(self):
        """Construct Mongo client."""
        self.client = MongoClient(**settings.MONGODB)

    def __getitem__(self, id: str):
        """Get latest form."""
        data = self.client.drink.items.find_one()
        data = self.client.drink.items.find({"_id": ObjectId(id)}, {"_id": 0}).next()
        return data["form"]
