"""App."""
import os

from flask import Flask, request, redirect, session, jsonify, url_for
from loguru import logger

from oauth import gen_login_url, get_userinfo

app = Flask(__name__)
app.config["SECRET_KEY"] = os.urandom(24)
app.config["PERMANENT_SESSION_LIFETIME"] = 60


@app.route("/redirect")
def login_redirect():
    """Login redirect."""
    code = request.args.get("code")
    data = get_userinfo(code)
    logger.info(data)
    session.permanent = True
    session["user"] = data
    return redirect(url_for("user"))


@app.route("/login")
def login():
    """Login."""
    return redirect(gen_login_url())


@app.route("/user")
def user():
    """User info."""
    data = session.get("user")
    if not data:
        return "401 Unauthorized", 401
    return jsonify(data)
