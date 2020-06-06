"""Retrieving authorization_code from authorization API."""
from urllib.parse import urlencode
import json

from loguru import logger
from jwcrypto import jwe
from jwcrypto.common import json_encode
import requests


from db import AuthToken
import settings


client_id = "67320997794-5c21iin6ti7o5ihvugic84g03gaqrelj.apps.googleusercontent.com"
client_secret = "9PMLulb0qUkliNdv70dM3mq8"
redirect_uri = "http://welfare.local.com:5000/redirect"
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
    if (data := AuthToken()[token]):
        logger.debug(f"Retrieve user data from cache: {data}")
        return data
    jwetoken = jwe.JWE()
    jwetoken.deserialize(token)
    jwetoken.decrypt(settings.JWK_KEY)
    AuthToken()[token] = jwetoken.payload
    logger.debug(f"Cache user data: {jwetoken.payload}")
    return json.loads(jwetoken.payload)


def encrypt(data: str) -> str:
    """Encrypt to JWE token."""
    token = jwe.JWE(
        data.encode("utf-8"), json_encode({"alg": "A256KW", "enc": "A256CBC-HS512"})
    )
    token.add_recipient(settings.JWK_KEY)
    return token.serialize(compact=True)
