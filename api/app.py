from dolma_search import glog, error, custom
from dolma_search.api import v1
from werkzeug import exceptions
from werkzeug.middleware import proxy_fix

import os
import logging
import flask

def create_app() -> proxy_fix.ProxyFix:
    # If LOG_FORMAT is "google:json" emit log message as JSON in a format Google Cloud can parse.
    fmt = os.getenv("LOG_FORMAT")
    handlers = [glog.Handler()] if fmt == "google:json" else []
    level = os.environ.get("LOG_LEVEL", default=logging.INFO)
    logging.basicConfig(level=level, handlers=handlers)

    app = flask.Flask("dolma_search", static_url_path="/api/static")
    app.json = custom.JSONProvider(app)
    app.get("/api/health")(lambda: ("", 204))
    app.register_blueprint(v1.Server(), url_prefix="/api/v1")
    app.register_error_handler(Exception, error.handle)

    # Use the X-Forwarded-* headers to set the request IP, host and port. Technically there
    # are two reverse proxies in deployed environments, but we "hide" the reverse proxy deployed
    # as a sibling of the API by forwarding the X-Forwarded-* headers rather than chaining them.
    return proxy_fix.ProxyFix(app, x_for=1, x_proto=1, x_host=1, x_port=1)

