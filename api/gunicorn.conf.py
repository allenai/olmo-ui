"""
This configuration file allows us to derive gunicorn configuration settings
from a file on disk.

See https://docs.gunicorn.org/en/stable/configure.html#configuration-file for
more information about how it works
"""
from dolma_search.config import Config

cfg = Config.load()

workers = cfg.gunicorn.workers
timeout = cfg.gunicorn.timeout
bind = cfg.gunicorn.bind
enable_stdio_inheritance = cfg.gunicorn.enable_stdio_inheritance
accesslog = cfg.gunicorn.accesslog
access_log_format = cfg.gunicorn.access_log_format
reload = cfg.gunicorn.reload
