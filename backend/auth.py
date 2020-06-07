"""Retrieving authorization_code from authorization API."""
from urllib.parse import urlencode
import json

from loguru import logger
from jwcrypto import jwe
from jwcrypto.common import json_encode
import requests


from db import AuthToken
import exceptions
import settings


client_id = "67320997794-5c21iin6ti7o5ihvugic84g03gaqrelj.apps.googleusercontent.com"
client_secret = "9PMLulb0qUkliNdv70dM3mq8"
redirect_uri = settings.OAUTH_REDIRECT_URL
base_url = r"https://accounts.google.com/o/oauth2/"


def gen_login_url():
    """Retrieve authorization code."""
    authorization_code_req = {
        "response_type": "code",
        "client_id": client_id,
        "redirect_uri": redirect_uri,
        "scope": (
            r"https://www.googleapis.com/auth/userinfo.profile"
            + r" https://www.googleapis.com/auth/userinfo.email"
        ),
    }

    r = requests.get(
        base_url + "auth?%s" % urlencode(authorization_code_req), allow_redirects=False
    )
    url = r.headers.get("location")
    return url


def retrieve_tokens(authorization_code):
    """Retrieve token."""
    access_token_req = {
        "code": authorization_code,
        "client_id": client_id,
        "client_secret": client_secret,
        "redirect_uri": redirect_uri,
        "grant_type": "authorization_code",
    }
    content_length = len(urlencode(access_token_req))
    access_token_req["content-length"] = str(content_length)

    r = requests.post(base_url + "token", data=access_token_req)
    data = json.loads(r.text)
    return data


def get_userinfo(code):
    """Get user info."""
    tokens = retrieve_tokens(code)
    access_token = tokens["access_token"]
    authorization_header = {"Authorization": f"OAuth {access_token}"}
    r = requests.get(
        "https://www.googleapis.com/oauth2/v2/userinfo", headers=authorization_header
    )
    return r.json()


def decrypt(token: str) -> str:
    """Decrypt JWE token."""
    jwetoken = jwe.JWE()
    jwetoken.deserialize(token)
    jwetoken.decrypt(settings.JWK_KEY)
    return jwetoken.payload


def encrypt(data: dict) -> str:
    """Encrypt to JWE token."""
    if data["email"].split("@")[-1] not in settings.EMAIL_ALLOWED_DOMAINS:
        raise exceptions.DomainNotAllowedError(data['email'])
    payload = json.dumps(data)
    token = jwe.JWE(
        payload.encode("utf-8"), json_encode({"alg": "A256KW", "enc": "A256CBC-HS512"})
    )
    token.add_recipient(settings.JWK_KEY)
    token = token.serialize(compact=True)
    AuthToken()[token] = payload
    logger.debug(f"Save user data to cache: {data['email']}")
    return token


def get_userinfo_from_token(token: str) -> dict:
    """Get user info from a JWE token."""
    if (payload := AuthToken()[token]):
        data = json.loads(payload)
        logger.debug(f"Retrieve from cache: {data['email']}")
        return data
    else:
        payload = decrypt(token)
        data = json.loads(payload)
        if (user := data.get('email')):
            # XXX: If a token can be decrypted, I assume it was issued by me,
            # and why it couldn't be found is that it was expired.
            # There's no plan for storing issued tokens, so this is the best
            # bet to check if a token is expired.
            raise exceptions.TokenExpiredError(user)
