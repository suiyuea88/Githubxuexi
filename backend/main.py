from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from requests import RequestException

from backend.github_api import get_hot_projects


app = FastAPI(
    title="GitHub每日精选"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/projects")
@app.get("/api/projects")
def projects():
    try:
        return get_hot_projects()
    except RequestException as exc:
        return {"error": "GitHub 数据暂时不可用，请稍后重试", "detail": str(exc), "projects": []}


@app.get("/health")
def health():
    return {"status": "ok"}


# API 路由放在前面，最后把前端挂到根路径。这样 Render 一个服务即可同时运行网页和接口。
frontend_dir = Path(__file__).resolve().parent.parent / "frontend"
app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="frontend")
