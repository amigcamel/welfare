"""Settings."""
import os

DEBUG = os.environ.get("DEBUG", False)
FAKE_LOGIN = DEBUG and os.environ.get("FAKE_LOGIN", False)
FAKE_USER_DATA = {
    "email": "aji@ffn.com",
    "english_name": "Aji Liu",
    "chinese_name": "劉阿吉",
    "picture": "/assets/icons/gandalf.svg"
}
FAKE_TOKEN = "test_token"

APP_SECRET = os.environ["APP_SECRET"]
JWK_KEY = os.environ["JWK_KEY"]
OAUTH_BASE_URL = os.environ["OAUTH_BASE_URL"]
OAUTH_CLIENT_SECRET = os.environ["OAUTH_CLIENT_SECRET"]
EMAIL_ALLOWED_DOMAINS = os.environ["EMAIL_ALLOWED_DOMAINS"].split(",")
SITE_URL = os.environ["SITE_URL"]
OAUTH_CLIENT_ID = os.environ["OAUTH_CLIENT_ID"]

MONGODB = {"host": "mongo", "port": 27017}
REDIS = {"host": "redis", "port": 6379, "db": 0}
AUTH_TOKEN_TTL = 120 * 60
LOGIN_REDIRECT_URL = f"{SITE_URL}/#/home?token={{token}}"
OAUTH_REDIRECT_URL = f"{SITE_URL}/api/login"
NOAUTH_REDIRECT_URL = f"{SITE_URL}/#/error-page/no-auth"
