import os
import time
from datetime import datetime, timedelta, timezone

import requests

from backend.translator import analyze_project

GITHUB_SEARCH_URL = "https://api.github.com/search/repositories"
_cache = {"expires": 0.0, "data": []}


def _headers() -> dict:
    headers = {"Accept": "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28"}
    token = os.getenv("GITHUB_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token}"
    return headers


def get_hot_projects() -> list[dict]:
    now = time.time()
    if _cache["data"] and now < _cache["expires"]:
        return _cache["data"]

    before = datetime.now(timezone.utc) - timedelta(days=30)
    response = requests.get(
        GITHUB_SEARCH_URL,
        params={"q": f"created:>{before.date()}", "sort": "stars", "order": "desc", "per_page": 20},
        headers=_headers(),
        timeout=15,
    )
    response.raise_for_status()
    items = response.json().get("items", [])

    result = []
    for repo in items:
        metadata = {
            "name": repo.get("name"),
            "description": repo.get("description"),
            "language": repo.get("language"),
            "topics": repo.get("topics", []),
            "homepage": repo.get("homepage"),
            "has_releases": bool(repo.get("releases_url")),
        }
        result.append({
            "name": repo.get("name"),
            "author": repo.get("owner", {}).get("login"),
            "stars": repo.get("stargazers_count", 0),
            "language": repo.get("language") or "多语言",
            "url": repo.get("html_url"),
            "homepage": repo.get("homepage"),
            "updated_at": repo.get("updated_at"),
            "analysis": analyze_project(metadata),
        })

    _cache.update({"expires": now + 900, "data": result})
    return result
