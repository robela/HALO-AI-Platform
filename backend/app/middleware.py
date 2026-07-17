import time
from fastapi import Request
from fastapi.responses import Response
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint

from .logging_utils import get_logger

logger = get_logger(__name__)

MAX_BODY_BYTES = 16 * 1024


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        start = time.perf_counter()
        # Redact Authorization header before logging
        headers = {
            k: ("***" if k.lower() == "authorization" else v)
            for k, v in request.headers.items()
        }
        response = await call_next(request)
        elapsed_ms = (time.perf_counter() - start) * 1000
        logger.debug(
            "%s %s -> %s (%.1fms)",
            request.method,
            request.url.path,
            response.status_code,
            elapsed_ms,
        )
        return response
