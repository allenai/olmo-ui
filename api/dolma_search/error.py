from flask import jsonify
from flask.typing import ResponseReturnValue
from werkzeug.exceptions import HTTPException

def handle(e: Exception) -> ResponseReturnValue:
    # If it's a HTTP exception, return the details to the client.
    if isinstance(e, HTTPException):
        code = e.code if e.code is not None else 500
        r = jsonify({ "error": { "code": code, "message": e.description }})
        r.status = code
        return r
    # Otherwise return a generic 500 to avoid leaking details we shouldn't.
    else:
        code = 500
        message = "The server encountered an internal error and was unable to complete your request"
        r = jsonify({ "error": { "code": code, "message": message }})
        r.status = code
        return r

