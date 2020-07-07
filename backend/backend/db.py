"""Database."""
from datetime import datetime
from typing import Union

from bson.errors import InvalidId
from loguru import logger
from pymongo import MongoClient
from redis import StrictRedis

from . import settings
from . import exceptions
from .qr import QR


# XXX: add DBMixin?


class Staff:
    """Handle staff profile."""

    def __init__(self, email: Union[str, None] = None):
        """Construct Mongo client."""
        self.email = email
        self.db = MongoClient(**settings.MONGODB)["staff"]

    @property
    def profile(self):
        """Get user profile."""
        return self.db.profile.find_one({"email": self.email}, {"_id": 0})


class AfternoonTea:
    """Handle AfternoonTea."""

    def __init__(self, *, col: Union[str, None], user: Union[str, None]):
        """Construct Mongo client."""
        self.__dbname = "afternoontea"
        self.__colname = col
        self.db = MongoClient(**settings.MONGODB)[self.__dbname]
        self.col = self.__colname  # FIXME
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
        pat = f"{self.__dbname}|{self.__colname}|{self.user}"
        data["qr"] = QR.encrypt(pat)
        data["update_time"] = datetime.now()
        Order(self.user, self.col).transform_and_save(data)
        return self.db[self.col].update({"user": self.user}, data, upsert=True)


class Order:
    """Handle afternoontea tea result."""

    def __init__(self, user: str, col: Union[str, None] = None):
        """Construct order object."""
        self.db = MongoClient(**settings.MONGODB)["order"]
        self.col = col
        self.user = user

    def __repr__(self):
        """__repr__ method."""
        return f"<Order: user={self.user} col={self.col}>"

    def __iter__(self):
        """Get order history."""
        for col in self.db.list_collection_names():
            if (doc := self.db[col].find_one({"user": self.user}, {"_id": 0})) :
                yield doc

    def get(self):
        """Get order(s)."""
        if self.user is None:
            cond = {}
        else:
            cond = {"user": self.user}
        docs = self.db[self.col].find(cond, {"_id": 0, "user": 1, "collected": 1})
        staff = (
            Staff()
            .db["profile"]
            .find({}, {"_id": 0, "email": 1, "english_name": 1, "sid": 1})
        )
        staff_dic = {i["email"]: i for i in staff}
        con = []
        for doc in docs:
            user = doc["user"]
            con.append(
                {
                    "name": staff_dic[user]["english_name"],
                    "email": staff_dic[user]["email"],
                    "sid": staff_dic[user]["sid"],
                    "collected": doc["collected"],
                }
            )
        return con

    def update(self, data: dict):
        """Update order."""
        stat = self.db[self.col].update(
            {"user": self.user}, {"$set": data}, upsert=False
        )
        return stat

    def transform_and_save(self, data: dict):
        """Transform data to order format and save to db."""
        orders = []
        for form in data["form"]:
            for item in form["items"]:
                if item["value"] == 0:
                    continue
                extras = []
                price = item["selections"]["size"]
                for i in item["options"]:
                    if i["optionLabel"] == "Size":
                        size = {
                            j["price"]: j["selectionLabel"]
                            for j in i["radioSelections"]
                        }[
                            item["selections"]["size"]
                        ]  # XXX: dirty and slow, should be optimized
                    elif i["optionLabel"] == "Extra":
                        for j in i["checkBoxOptions"]:
                            if j["choose"]:
                                extras.append(j["selectionLabel"])
                                price += j["price"]

                orders.append(
                    {
                        "item": item["itemLabel"],
                        "ice": item["selections"].get("ice"),
                        "sugar": item["selections"].get("sugar"),
                        "price": price,
                        "value": item["value"],
                        "size": size,
                        "options": extras,
                    }
                )
        res = {
            "user": self.user,
            "date": data["expiration"],
            "orders": orders,
            "qr": data["qr"],
            "collected": False,
        }
        stat = self.db[self.col].update({"user": self.user}, res, upsert=True)
        logger.info(stat)


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
