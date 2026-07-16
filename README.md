# GitHub学习馆

每天抓取 GitHub 近期热门开源项目，并用中文解释项目用途、适合人群、安装运行方式、EXE 打包、网页部署、Docker 和二次开发难度。

## 目录结构

- `backend/`：FastAPI 接口、GitHub 数据抓取与中文分析
- `frontend/`：静态网页首页、项目详情页与国风背景
- `README.md`：项目说明

## 本地运行

后端：

```bash
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload
```

打开 `http://127.0.0.1:8000` 即可同时使用网页和接口。前后端已改为同源连接，不再需要在 JavaScript 中写死 Render 地址。

## Render 配置

- Root Directory：留空
- Build Command：`pip install -r backend/requirements.txt`
- Start Command：`uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
- Health Check Path：`/health`

可选环境变量 `GITHUB_TOKEN`：配置后能提高 GitHub API 调用额度。不要把 Token 写进代码或上传到 GitHub。
