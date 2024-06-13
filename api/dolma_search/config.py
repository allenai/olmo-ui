import json
import typing as t
from dataclasses import dataclass


@dataclass
class Timeouts:
    # The global timeout for all operations in seconds, after which requests are aborted.
    all: float = 60.0
    # The timeout for search queries in seconds, after which partial results are returned.
    # NOTE: Yes, this timeout is an int (that gets sent on the wire as a string), while the
    # global timeout is a float. This is what Elasticsearch expects.
    search: int = 30


@dataclass
class Elastic:
    endpoint: str
    api_key: str
    api_key_1_7: str
    timeouts: Timeouts


@dataclass
class ServiceAccount:
    path: str


@dataclass
class BigQueryAnalytics:
    project: str
    dataset: str


# We (by default) extend the default request/access log
default_access_log_format = json.dumps(
    {
        "timestamp": "%(t)s",
        "request_ip": "%(h)s",
        "x_forwarded_for": "%({X-Forwarded-For}i)s",
        "request_id": "%({X-Request-Id}i)s",
        "response_code": "%(s)s",
        "request_method": "%(m)s",
        "request_path": "%(U)s",
        "request_query": "%(q)s",
        "response_time": "%(D)s",
        "response_length": "%(B)s",
        "user_agent": "%(a)s",
    }
)


@dataclass
class Gunicorn:
    """
    Gunicorn settings. See:
    https://docs.gunicorn.org/en/stable/settings.html#settings
    """

    workers: int = 1
    # By setting this to 0, we disable the timeout. We do this as we (should)
    # use timeouts for the external services we rely on.
    timeout: int = 0
    bind: str = "0.0.0.0:8000"
    # This default prevents gunicorn from capturing stdout/stderr.
    enable_stdio_inheritance: bool = True
    # This default tells gunicorn to write the request/access logs to stdout
    accesslog: t.Optional[str] = "-"
    access_log_format: str = default_access_log_format
    # By default watch for changes and reload when they occur; this should be disabled
    # in production settings.
    reload: bool = True


@dataclass
class Config:
    es: Elastic
    sa: ServiceAccount
    bq: BigQueryAnalytics
    gunicorn: Gunicorn

    @classmethod
    def load(cls, path: str = "/secret/config/config.json") -> t.Self:
        with open(path) as f:
            data = json.load(f)
            timeouts = Timeouts(**data["es"].get("timeouts", {}))
            es = Elastic(
                endpoint=data["es"]["endpoint"],
                api_key=data["es"]["api_key"],
                api_key_1_7=data["es"]["api_key_1_7"],
                timeouts=timeouts,
            )
            sa = ServiceAccount(
                path=data.get("sa", {}).get(
                    "path", "/secret/config/service_account.json"
                )
            )
            bq = BigQueryAnalytics(
                project=data.get("bq", {}).get("project", "ai2-reviz"),
                dataset=data.get("bq", {}).get("dataset", "dolma_test"),
            )
            gu = Gunicorn(**data.get("gunicorn", {}))
            return cls(es, sa, bq, gu)
