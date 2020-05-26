"""App."""
import os

from flask import Flask, request, redirect, jsonify, url_for
from loguru import logger
import jwt

from oauth import gen_login_url, get_userinfo

app = Flask(__name__)
SECRET_KEY = os.urandom(24)
app.config["SECRET_KEY"] = SECRET_KEY


@app.before_request
def auth():
    """Authenticate."""
    if request.path in (url_for("login"), url_for("login_redirect")):
        return
    token = request.args.get("token")
    if token:
        data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        logger.debug(data)
    else:
        return "Unauthorized", 401


@app.route("/redirect")
def login_redirect():
    """Login redirect."""
    code = request.args.get("code")
    if not code:
        return "Code is not provided", 400
    data = get_userinfo(code)
    logger.info(data)
    token = jwt.encode(data, SECRET_KEY, algorithm="HS256").decode("utf-8")
    return jsonify({"token": token})


@app.route("/login")
def login():
    """Login."""
    return redirect(gen_login_url())


@app.route("/user")
def user():
    """User info."""
    token = request.args.get("token")
    data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    return jsonify(data)
