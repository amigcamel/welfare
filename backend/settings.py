"""Settings."""
import pickle

APP_SECRET = b"\x05!;\xc1X\xf1;\xfd\xfeI\xc4\xf5R\xd1\xf4\x92\xa4\x90-{9\xd3\x9e\xa6"
JWK_KEY = pickle.loads(
    b"\x80\x04\x95\x82\x00\x00\x00\x00\x00\x00\x00\x8c\x0cjwcrypto.jwk\x94\x8c\x03JWK\x94\x93\x94)\x81\x94}\x94(\x8c\x07_params\x94}\x94\x8c\x03kty\x94\x8c\x03oct\x94s\x8c\x04_key\x94}\x94\x8c\x01k\x94\x8c+lP8ISAVLUg1hYy8FZ225aVCH-ipvvodi79BO0rknlrA\x94s\x8c\x08_unknown\x94}\x94ub."
)  # noqa: E501
MONGODB = {"host": "localhost", "port": 27017}
EMAIL_ALLOWED_DOMAINS = ["ffn.com"]
