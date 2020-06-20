"""Utilities."""
import gzip

from flask import json, make_response


def gzip_jsonify(data: dict):
    content = gzip.compress(json.dumps(data).encode("utf-8"), 6)
    response = make_response(content)
    response.headers["Content-Type"] = "application/json"
    response.headers["Content-length"] = len(content)
    response.headers["Content-Encoding"] = "gzip"
    return response
