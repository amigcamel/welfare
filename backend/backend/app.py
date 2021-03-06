"""App."""
from datetime import datetime
import re
import traceback

from flask import Flask, request, redirect, jsonify, url_for, g
from loguru import logger

from .auth import gen_login_url, get_userinfo, encrypt, get_userinfo_from_token
from .db import AfternoonTea, AuthToken, Order, Staff
from .qr import QR
from .utils import send_action
from . import (
    settings,
    exceptions,
    get_default_form,
    get_billboard,
    get_coming_soon,
    get_default_col,
)

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
    for route in (url_for("login"),):
        if re.search(request.path, route):
            return
    auth = request.headers.get("Authorization")
    if auth:
        token = request.headers["Authorization"].split("Bearer")[-1].strip()
        data = get_userinfo_from_token(token)
        g.token = token
        g.user = data["email"]
    else:
        raise exceptions.UnauthorizedError("Unauthorized")


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
        logger.critical(traceback.format_exc())
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
    if col is None:
        col = get_default_col()
    if request.method == "GET":
        try:
            data = AfternoonTea(col=col, user=g.user).get()
        except exceptions.NoAfternoonTeaFound:
            data = get_default_form(col=col)
        return jsonify(data)

    elif request.method == "POST":
        data = request.json
        res = AfternoonTea(col=col, user=g.user).upsert(data=data)
        logger.info(res)
        return jsonify({"update_time": datetime.now()})


@app.route("/history", methods=["GET"])  # XXX: should it be /afternoontea/history ?
def history():
    """Afternoon order history."""
    return jsonify(list(Order(g.user)))


@app.route("/order", defaults={"col": None}, methods=["GET", "POST"])
@app.route("/order/<col>", methods=["GET", "POST"])
def order(col):
    """CRUD order."""
    if col is None:
        col = get_default_col()
    if not Staff(g.user).is_admin:
        raise exceptions.UnauthorizedError(f"No admin permission: {g.user}")
    if request.method == "GET":
        user = request.args.get("user", None)  # TODO: DRY - request.args.get("user")

        # TODO: refactor - separate endpoints
        if user:
            return jsonify(list(Order(user=user, col=col)))
        else:
            return jsonify(Order(user=user, col=col).get())
    elif request.method == "POST":
        if (user := request.args.get("user")) and (data := request.get_json()):
            stat = Order(user=user, col=col).update(data)
            logger.info(stat)
            if stat["updatedExisting"]:
                send_action(action="update", token=g.token)
                return jsonify({"msg": "ok"})
            else:
                return jsonify({"msg": "update failed"}), 400  # TODO: make it clear
        else:
            return jsonify({"msg": "not ok"}), 400  # TODO: make it clear


@app.route("/qr", methods=["POST"])
def qr():
    """Handle QR hash."""
    qr = request.json.get("qr")
    if qr is None:
        return "No QR token", 400

    _, col, user = QR.decrypt(qr)

    # TODO: DRY - same as /order?user=<user>
    # TODO: add error handling
    stat = Order(user=user, col=col).update({"user": user, "collected": True})
    logger.info(stat)
    send_action(action="update", token=g.token)
    return jsonify(list(Order(user=user, col=col)))


@app.route("/token_info")
def token_info():  # XXX: requested by the internal only?
    """Show token status."""
    return jsonify(get_userinfo_from_token(g.token))


@app.route("/billboard", methods=["GET"])
def billboard():
    """Billboard endpoint."""
    return jsonify(get_billboard())


@app.route("/coming_soon", methods=["GET"])
def coming_soon():
    """Coming Soon endpoint."""
    return jsonify(get_coming_soon())
