"""init."""
import pymongo

from .db import AfternoonTea, App
from .deco import naive_cache


@naive_cache(ttl=3600, extend=True)
def get_default_form(col: str):
    """Get default afternoontea form."""
    return AfternoonTea(col=col, user=None).get(return_default=True)


@naive_cache(ttl=3600, extend=True)
def get_coming_soon():
    """Latest Coming Soon info."""
    return (
        App()
        .db.coming_soon.find({}, {"_id": 0})
        .sort([("_id", pymongo.DESCENDING)])
        .limit(1)
        .next()
    )


@naive_cache(ttl=3600, extend=True)
def get_billboard():
    """Latest billboard info."""
    return App().db.billboard.find_one({"_id": get_default_col()}, {"_id": 0})


@naive_cache(ttl=3600, extend=True)
def get_default_col():
    """Get default collection name."""
    return App().db.defaults.find_one({}, {"_id": -1, "afternoontea_collection": 1})[
        "afternoontea_collection"
    ]
