"""App."""
from datetime import datetime

from flask import Flask, request, redirect, jsonify, url_for, g
from loguru import logger

from auth import gen_login_url, get_userinfo, encrypt, get_userinfo_from_token
from db import AfternoonTea, AuthToken, Order
from utils import gzip_jsonify
import settings
import exceptions

app = Flask(__name__)
app.debug = settings.DEBUG
app.config["JSON_AS_ASCII"] = False
app.config["SECRET_KEY"] = settings.APP_SECRET


@app.before_request
def auth():
    """Authenticate."""
    logger.debug(request.headers)
    if settings.FAKE_LOGIN:
        g.token = "test_token"
        g.user = settings.FAKE_USER_DATA["email"]
        return
    if request.method == "OPTIONS":
        return
    if request.path in (url_for("login"),):
        return
    auth = request.headers.get("Authorization")
    if auth:
        token = request.headers["Authorization"].split("Bearer")[-1].strip()
        data = get_userinfo_from_token(token)
        g.token = token
        g.user = data["email"]
        return


@app.errorhandler(Exception)
def handle_error(error):
    """Handle errors for every request."""
    if issubclass(error.__class__, exceptions.CustomError):
        if isinstance(error, exceptions.DomainNotAllowedError):
            return redirect(settings.NOAUTH_REDIRECT_URL)
        response = jsonify({"msg": str(error), "status": error.args[1]})
        response.status_code = error.args[1]
        return response
    else:
        logger.critical(error)
        return "Internal Server Error", 500


@app.route("/login")
def login():
    """Login."""
    if settings.FAKE_LOGIN:
        return redirect(settings.LOGIN_REDIRECT_URL.format(token=settings.FAKE_TOKEN))
    if (code := request.args.get("code")) :
        data = get_userinfo(code)
        token = encrypt(data)
        return redirect(settings.LOGIN_REDIRECT_URL.format(token=token))
    else:
        return redirect(gen_login_url())


@app.route("/logout")
def logout():
    """Logout."""
    logger.info(f"Log out: {g.token}")
    del AuthToken()[g.token]
    return jsonify({"msg": "ok"})


@app.route("/user")
def user():
    """User info."""
    if settings.FAKE_LOGIN:
        return jsonify(settings.FAKE_USER_DATA)
    data = get_userinfo_from_token(g.token)
    return jsonify(data)


@app.route("/afternoontea", defaults={"col": None}, methods=["GET", "POST"])
@app.route("/afternoontea/<col>", methods=["GET", "POST"])
def afternoontea(col):
    """Afternoon Tea."""
    if not col:
        col = "demo_1"  # XXX: do not hardcode this
    if request.method == "GET":
        data = AfternoonTea(col=col, user=g.user).get(return_default=True)
        return gzip_jsonify(data)

    elif request.method == "POST":
        data = request.json
        res = AfternoonTea(col=col, user=g.user).upsert(data=data)
        logger.info(res)
        return jsonify({"update_time": datetime.now()})


@app.route("/history", methods=["GET"])  # XXX: should it be /afternoontea/history ?
def history():
    """Afternoon order history."""
    return jsonify(list(Order(g.user)))
