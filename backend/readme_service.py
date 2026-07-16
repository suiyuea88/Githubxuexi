"""Fetch public GitHub README files without storing repository content."""

import re
import requests

from backend.github_api import _headers


REPOSITORY_PATTERN = re.compile(r"^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$")


def get_readme(repository: str) -> dict:
    repo = repository.strip()
    if not REPOSITORY_PATTERN.fullmatch(repo):
        raise ValueError("仓库名称格式不正确")
    headers = _headers()
    headers["Accept"] = "application/vnd.github.raw+json"
    response = requests.get(f"https://api.github.com/repos/{repo}/readme", headers=headers, timeout=15)
    response.raise_for_status()
    content = response.text[:100_000]
    return {"repository": repo, "content": content, "truncated": len(response.text) > len(content)}
