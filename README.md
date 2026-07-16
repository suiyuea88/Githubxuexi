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

打开 `http://127.0.0.1:8000` 即可同时使用网页和接口。

## 接口强连接

页面会按以下顺序自动获取数据：

1. `frontend/config.js` 中配置的独立后端；
2. 当前域名的 `/projects` 或 `/api/projects`；
3. 浏览器本地的最近成功缓存；
4. GitHub 公共接口。

因此即使静态网站没有 `/projects` 路由、Render 后端休眠或临时不可用，首页仍可自动显示项目。前后端分开部署时，只需在 `frontend/config.js` 填入后端域名；同一个 Render 服务部署时保持空字符串。

## Render 配置

- Root Directory：留空
- Build Command：`pip install -r backend/requirements.txt`
- Start Command：`uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
- Health Check Path：`/health`

仓库根目录已经提供 `render.yaml`，也可以在 Render 选择 Blueprint 自动读取配置。务必创建 **Web Service**，不要只把 `frontend` 创建成 Static Site；否则同域 `/projects` 会返回 404，不过新版前端仍会自动走 GitHub 备用接口。

可选环境变量 `GITHUB_TOKEN`：配置后能提高 GitHub API 调用额度。不要把 Token 写进代码或上传到 GitHub。
