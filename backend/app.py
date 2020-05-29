"""App."""
import json

from flask import Flask, request, redirect, jsonify, url_for, g
from loguru import logger
from jwcrypto import jwe
from jwcrypto.common import json_encode

from oauth import gen_login_url, get_userinfo
import settings

app = Flask(__name__)
app.debug = True
app.config["SECRET_KEY"] = settings.APP_SECRET


def _decrypt(token):
    jwetoken = jwe.JWE()
    jwetoken.deserialize(token)
    jwetoken.decrypt(settings.JWK_KEY)
    return json.loads(jwetoken.payload)


def _encrypt(data):
    token = jwe.JWE(
        data.encode("utf-8"), json_encode({"alg": "A256KW", "enc": "A256CBC-HS512"})
    )
    token.add_recipient(settings.JWK_KEY)
    return token.serialize(compact=True)


@app.before_request
def auth():
    """Authenticate."""
    logger.debug(request.headers)
    if request.method == "OPTIONS":
        return
    if request.path in (url_for("login"), url_for("login_redirect")):
        return
    auth = request.headers.get("Authorization")
    if auth:
        try:
            token = request.headers["Authorization"].split("Bearer")[-1].strip()
            logger.debug(f"token -----> {token}")
            data = _decrypt(token)
            g.token = token
            logger.debug(data)
            return
        except Exception as e:
            logger.critical(e)
    return "Unauthorized", 401


@app.route("/redirect")
def login_redirect():
    """Login redirect."""
    code = request.args.get("code")
    if not code:
        return "Code is not provided", 400
    data = get_userinfo(code)
    logger.info(data)
    token = _encrypt(json.dumps(data))
    logger.debug(f"token: {token}")
    return redirect(f"http://localhost:4200/#/home?token={token}")


@app.route("/login")
def login():
    """Login."""
    return redirect(gen_login_url())


@app.route("/user")
def user():
    """User info."""
    data = _decrypt(g.token)
    return jsonify(data)


@app.route("/hello")
def hello():
    """Hello."""
    logger.debug(request.headers)
    return "", 200


@app.route("/byebye")
def byebye():
    """byebye."""
    return "", 401


@app.route("/token")
def token():
    """Token."""
    code = request.args.get("code")
    if not code:
        return "Code is not provided", 400
    data = get_userinfo(code)
    logger.info(data)
    token = _encrypt(data)
    return jsonify({"token": token})
