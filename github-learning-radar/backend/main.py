from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from github_api import get_hot_projects


app = FastAPI(
    title="GitHub每日精选"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/")
def home():

    return {
        "message":
        "GitHub每日精选运行成功"
    }



@app.get("/projects")
def projects():

    data = get_hot_projects()

    return data
