"""App."""
from datetime import datetime
import json

from flask import Flask, request, redirect, jsonify, url_for, g
from loguru import logger

from auth import gen_login_url, get_userinfo, encrypt, authenticate
from db import AfternoonTea
import settings
import exceptions

app = Flask(__name__)
app.debug = True
app.config["JSON_AS_ASCII"] = False
app.config["SECRET_KEY"] = settings.APP_SECRET


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
        token = request.headers["Authorization"].split("Bearer")[-1].strip()
        data = authenticate(token)
        g.token = token
        g.user = data["email"]
        return


@app.errorhandler(Exception)
def handle_error(error):
    """Handle errors for every request."""
    if issubclass(error.__class__, exceptions.CustomError):
        response = jsonify({"msg": str(error), "status": error.args[1]})
        response.status_code = error.args[1]
        return response
    else:
        logger.critical(error)
        return "Internal Server Error", 500


@app.route("/redirect")
def login_redirect():
    """Login redirect."""
    code = request.args.get("code")
    if not code:
        return "Code is not provided", 400
    data = get_userinfo(code)
    logger.info(data)
    token = encrypt(json.dumps(data))
    logger.debug(f"token: {token}")
    return redirect(f"http://localhost:4200/#/home?token={token}")


@app.route("/login")
def login():
    """Login."""
    return redirect(gen_login_url())


@app.route("/user")
def user():
    """User info."""
    data = authenticate(g.token)  # TODO: consider rename `authenticate`
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
    token = encrypt(data)
    return jsonify({"token": token})


@app.route("/afternoontea/<col>", methods=["GET", "POST"])
def afternoontea(col):
    """Afternoon Tea."""
    if request.method == "GET":
        data = AfternoonTea(col=col, user=g.user).get(return_default=True)
        return jsonify(data)
    elif request.method == "POST":
        data = request.json
        output = {'update_time': datetime.now()}
        data.update(output)
        res = AfternoonTea(col=col, user=g.user).upsert(data=data)
        logger.info(res)
        return jsonify(output)
