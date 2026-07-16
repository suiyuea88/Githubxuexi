"""Inspect a public repository before claiming it can run in a browser sandbox."""

import base64
import json
import re
import requests

from backend.github_api import _headers


REPOSITORY_PATTERN = re.compile(r"^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$")
WEB_DEPENDENCIES = {"vite", "next", "react", "react-dom", "vue", "svelte", "@angular/core", "astro", "parcel"}


def probe_runtime(repository: str) -> dict:
    repo = repository.strip()
    if not REPOSITORY_PATTERN.fullmatch(repo):
        raise ValueError("仓库名称格式不正确")
    response = requests.get(f"https://api.github.com/repos/{repo}/contents", headers=_headers(), timeout=15)
    response.raise_for_status()
    entries = response.json()
    if not isinstance(entries, list):
        return {"runnable": False, "kind": "unknown", "reason": "无法识别仓库根目录"}
    names = {str(item.get("name", "")).lower(): item for item in entries}

    if "index.html" in names:
        return {"runnable": True, "kind": "static", "reason": "根目录包含 index.html，可尝试静态网页预览"}
    package = names.get("package.json")
    if package:
        package_response = requests.get(package.get("url"), headers=_headers(), timeout=15)
        package_response.raise_for_status()
        payload = package_response.json()
        raw = base64.b64decode(payload.get("content", "")).decode("utf-8", errors="replace")
        data = json.loads(raw or "{}")
        scripts = data.get("scripts") or {}
        dependencies = {**(data.get("dependencies") or {}), **(data.get("devDependencies") or {})}
        has_start = any(key in scripts for key in ("dev", "start", "serve", "preview"))
        web_stack = bool(WEB_DEPENDENCIES.intersection(dependencies))
        if has_start and web_stack:
            return {"runnable": True, "kind": "node-web", "reason": "检测到前端框架和可执行启动脚本", "scripts": list(scripts)[:12]}
        return {"runnable": False, "kind": "node-other", "reason": "虽然有 package.json，但没有同时检测到前端框架与 dev/start 启动脚本"}
    return {"runnable": False, "kind": "non-web", "reason": "根目录没有 package.json 或 index.html，不应当作可运行网页项目"}
