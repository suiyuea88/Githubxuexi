import os
import time
from datetime import datetime, timedelta, timezone

import requests

from backend.translator import analyze_project

GITHUB_SEARCH_URL = "https://api.github.com/search/repositories"
_cache = {"expires": 0.0, "data": []}
_search_cache: dict[str, dict] = {}

SEARCH_ALIASES = {
    "tg机器人": "telegram bot", "telegram机器人": "telegram bot", "电报机器人": "telegram bot",
    "人工智能": "artificial intelligence", "聊天机器人": "chatbot", "爬虫": "web scraper",
    "自动化": "automation", "网页": "web", "小程序": "mini app", "翻译": "translator",
}


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

    result = [_format_project(repo) for repo in items]

    _cache.update({"expires": now + 900, "data": result})
    return result


def search_projects(query: str, limit: int = 20, page: int = 1) -> dict:
    raw = " ".join(query.strip().split())
    if len(raw) < 2:
        raise ValueError("请至少输入 2 个字符")
    if len(raw) > 100:
        raise ValueError("搜索内容过长")
    normalized = SEARCH_ALIASES.get(raw.lower(), raw)
    page = min(max(page, 1), 10)
    page_size = min(max(limit, 1), 30)
    key = f"{normalized}:{page_size}:{page}"
    cached = _search_cache.get(key)
    if cached and time.time() < cached["expires"]:
        return {"query": raw, "github_query": normalized, **cached["payload"], "cached": True}
    response = requests.get(
        GITHUB_SEARCH_URL,
        params={"q": normalized, "sort": "stars", "order": "desc", "per_page": page_size, "page": page},
        headers=_headers(), timeout=15,
    )
    response.raise_for_status()
    result_payload = response.json()
    projects = [_format_project(repo) for repo in result_payload.get("items", [])]
    total = min(int(result_payload.get("total_count", len(projects))), 1000)
    payload = {"projects": projects, "page": page, "total_count": total, "has_more": page * page_size < total and bool(projects)}
    _search_cache[key] = {"expires": time.time() + 600, "payload": payload}
    if len(_search_cache) > 80:
        _search_cache.pop(next(iter(_search_cache)), None)
    return {"query": raw, "github_query": normalized, **payload, "cached": False}


def _format_project(repo: dict) -> dict:
    metadata = {
        "name": repo.get("name"), "description": repo.get("description"),
        "language": repo.get("language"), "topics": repo.get("topics", []),
        "homepage": repo.get("homepage"), "has_releases": bool(repo.get("releases_url")),
    }
    return {
        "name": repo.get("name"), "full_name": repo.get("full_name"),
        "author": repo.get("owner", {}).get("login"), "stars": repo.get("stargazers_count", 0),
        "language": repo.get("language") or "多语言", "url": repo.get("html_url"),
        "homepage": repo.get("homepage"), "updated_at": repo.get("updated_at"),
        "analysis": analyze_project(metadata),
    }
