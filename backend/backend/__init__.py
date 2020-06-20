"""init."""
from .db import AfternoonTea
from .deco import naive_cache


@naive_cache(ttl=10, extend=True)
def get_default_form(col: str):
    """Get default afternoontea form."""
    return AfternoonTea(col=col, user=None).get(return_default=True)
