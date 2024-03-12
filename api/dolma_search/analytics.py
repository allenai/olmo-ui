from dataclasses import dataclass, field
from google.oauth2.service_account import Credentials
from google.cloud import bigquery
from . import config
from datetime import datetime, timezone

import typing as t
import json

@dataclass
class Event:
    type: str
    url: str
    occurred: datetime
    details: t.Optional[dict[str, t.Any]] = None

class Client:
    def __init__(self, c: config.BigQueryAnalytics, creds: Credentials):
        self.config = c
        self.bq = bigquery.Client(project=self.config.project, credentials=creds)

    def insert(self, e: Event):
        """
        Insert an event and block until completion.
        """
        query = f"""
            INSERT INTO
                `{self.config.dataset}.event` (type, url, occurred, details)
            VALUES
                (@type, @url, @occurred, @details)
        """
        job = self.bq.query(query, job_config=bigquery.QueryJobConfig(
            query_parameters=[
                bigquery.ScalarQueryParameter("type", "STRING", e.type),
                bigquery.ScalarQueryParameter("url", "STRING", e.url),
                bigquery.ScalarQueryParameter("occurred", "TIMESTAMP", e.occurred),
                bigquery.ScalarQueryParameter("details", "JSON", json.dumps(e.details) if e is not None else None)
            ]
        ))
        _ = job.result()
        return True

