"""Settings."""
import pickle

DEBUG = True
APP_SECRET = b"\x05!;\xc1X\xf1;\xfd\xfeI\xc4\xf5R\xd1\xf4\x92\xa4\x90-{9\xd3\x9e\xa6"
JWK_KEY = pickle.loads(
    b"\x80\x04\x95\x82\x00\x00\x00\x00\x00\x00\x00\x8c\x0cjwcrypto.jwk\x94\x8c\x03JWK\x94\x93\x94)\x81\x94}\x94(\x8c\x07_params\x94}\x94\x8c\x03kty\x94\x8c\x03oct\x94s\x8c\x04_key\x94}\x94\x8c\x01k\x94\x8c+lP8ISAVLUg1hYy8FZ225aVCH-ipvvodi79BO0rknlrA\x94s\x8c\x08_unknown\x94}\x94ub."
)  # noqa: E501
MONGODB = {"host": "mongo", "port": 27017}
REDIS = {"host": "redis", "port": 6379, "db": 0}
AUTH_TOKEN_TTL = 120 * 60
LOGIN_REDIRECT_URL = "http://localhost:4200/#/home?token={token}"
OAUTH_REDIRECT_URL = "http://welfare.local.com:5000/login"
OAUTH_CLIENT_ID = (
    "67320997794-5c21iin6ti7o5ihvugic84g03gaqrelj.apps.googleusercontent.com"
)
OAUTH_BASE_URL = "https://accounts.google.com/o/oauth2/"
OAUTH_CLIENT_SECRET = "9PMLulb0qUkliNdv70dM3mq8"
EMAIL_ALLOWED_DOMAINS = ["ffn.com"]
