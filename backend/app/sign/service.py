"""Sign language generation service.

Currently returns pre-built video asset URLs keyed by normalised word tokens.
Replace the `_resolve_video_url` implementation with an avatar-rendering
engine or an external API (e.g. SignAll, HandSpeak) when available.
"""

from __future__ import annotations

import os
import re
from dataclasses import dataclass
from typing import Optional

from ..logging_utils import get_logger

logger = get_logger(__name__)

# Base URL where sign-language video assets are served (configurable via env).
_ASSET_BASE_URL = os.getenv("SIGN_ASSET_BASE_URL", "/static/signs")


@dataclass
class SignResult:
    video_url: Optional[str]
    status: str   # "completed" | "failed"


def _normalise(text: str) -> str:
    """Lower-case, strip punctuation, collapse whitespace."""
    text = text.lower().strip()
    text = re.sub(r"[^\w\s]", "", text)
    return re.sub(r"\s+", "-", text)


def _resolve_video_url(text: str, language: str) -> Optional[str]:
    """
    Map normalised text to a video asset URL.

    Extend this function to call an external sign-language rendering API
    or look up a database of pre-recorded clips.
    """
    slug = _normalise(text)
    # Limit slug length to avoid excessively long URLs
    if len(slug) > 100:
        slug = slug[:100]
    return f"{_ASSET_BASE_URL}/{language}/{slug}.mp4"


async def generate_sign_language(text: str, language: str = "en") -> SignResult:
    """Generate a sign-language video URL for the given text."""
    try:
        video_url = _resolve_video_url(text, language)
        logger.debug("Sign URL generated: %s", video_url)
        return SignResult(video_url=video_url, status="completed")
    except Exception as exc:
        logger.error("Sign generation failed: %s", exc)
        return SignResult(video_url=None, status="failed")
