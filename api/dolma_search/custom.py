from datetime import datetime
from flask.json import provider
from typing import Any
from dataclasses import is_dataclass, asdict

import json

class JSONEncoder(json.JSONEncoder):
    """
    Custom JSONEncoder that:
    - emits datetime objects as ISO strings
    - handles dataclasses implicitly by calling asdict()
    """
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.isoformat()
        if is_dataclass(obj):
            return asdict(obj)
        return json.JSONEncoder.default(self, obj)

class JSONProvider(provider.JSONProvider):
    """
    Flask JSONProvider that uses JSONEncoder.

    NOTE: The extensions provided by JSONEncoder are only applied when encoding JSON.
    This provider does not provide the same capabilities for decoding.
    """
    def dumps(self, obj: Any, **kwargs: Any) -> str:
        kwargs.setdefault("ensure_ascii", True)
        kwargs.setdefault("sort_keys", True)
        kwargs.setdefault("indent", 2 if self._app.debug else None)
        kwargs.setdefault("cls", JSONEncoder)
        return json.dumps(obj, **kwargs)

    def loads(self, s: str | bytes | bytearray, **kwargs: Any) -> Any:
        return json.loads(s, **kwargs)
