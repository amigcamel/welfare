"""Decorators."""
import functools
import json
import pickle
import traceback


from loguru import logger
from redis import StrictRedis

from . import settings


def naive_cache(ttl: int, extend: bool):
    """Cache decorator.

    Reference: https://stackoverflow.com/a/10220908
    """
    conn = StrictRedis(**settings.CACHE)

    def _decorator(func):
        @functools.wraps(func)
        def _wrapper(*args, **kwargs):
            try:
                key = json.dumps(
                    {
                        "func": func.__name__,
                        "args": args,
                        "kwargs": sorted(kwargs.items()),
                    }
                )
                logger.debug(f"Cache key: {key}")
            except Exception:
                key = None
                logger.warning(traceback.format_exc())
            if key:
                if (res := conn.get(key)) :
                    res = pickle.loads(res)
                    logger.debug(f"Get cached result: {func.__name__}")
                    if extend:
                        logger.debug(f"Extend cache: {func.__name__}; TTL: {ttl}")
                        conn.expire(key, ttl)
                else:
                    res = func(*args, **kwargs)
                    logger.debug(f"Set cache: {func.__name__}; TTL: {ttl}")
                    conn.set(key, pickle.dumps(res))
                    conn.expire(key, ttl)
            else:
                logger.info(f"Uncachable function: {func.__name__}")
                res = func(*args, **kwargs)
            return res

        return _wrapper

    return _decorator
