"""把 GitHub 仓库元数据整理成普通用户也能看懂的中文学习指南。"""


def _category(description: str, language: str, topics: list[str]) -> str:
    text = f"{description} {' '.join(topics)}".lower()
    if any(word in text for word in ("ai", "agent", "llm", "model", "machine-learning")):
        return "人工智能"
    if any(word in text for word in ("frontend", "web", "website", "browser")):
        return "Web开发"
    if language == "Python":
        return "Python项目"
    if any(word in text for word in ("cli", "developer-tool", "automation", "productivity")):
        return "开发工具"
    return "开源项目"


def _install_guide(language: str) -> tuple[str, str]:
    guides = {
        "Python": ("通常先安装 Python，再执行 pip install -r requirements.txt。", "通常执行 python main.py、python app.py，或按 README 提供的命令启动。"),
        "JavaScript": ("通常先安装 Node.js，再执行 npm install 或 npm ci。", "通常执行 npm run dev；生产环境使用 npm run build 和 npm start。"),
        "TypeScript": ("通常先安装 Node.js，再执行 npm install 或 npm ci。", "通常执行 npm run dev；生产环境使用 npm run build 和 npm start。"),
        "Java": ("通常需要 JDK，并使用 Maven 或 Gradle 安装依赖。", "查看项目中的 pom.xml、gradlew 或 README，按对应命令启动。"),
        "Go": ("通常先安装 Go，再执行 go mod download。", "常见方式为 go run .，也可以 go build 后运行生成文件。"),
        "Rust": ("通常先安装 Rust 与 Cargo，再执行 cargo build。", "开发运行常用 cargo run，发布构建使用 cargo build --release。"),
    }
    return guides.get(language, ("先查看 README、Releases 和项目根目录中的依赖文件。", "按 README 的 Quick Start、Usage 或 Getting Started 章节运行。"))


def analyze_project(repo: dict) -> dict:
    name = repo.get("name") or "未命名项目"
    description = (repo.get("description") or "作者暂未提供项目介绍").strip()
    language = repo.get("language") or "多语言"
    topics = repo.get("topics") or []
    category = _category(description, language, topics)
    install, run = _install_guide(language)
    has_pages = bool(repo.get("homepage"))
    has_releases = bool(repo.get("has_releases"))
    has_docker = "docker" in [topic.lower() for topic in topics]
    difficulty = "入门" if language in ("HTML", "CSS") else "中等"

    return {
        "一句话介绍": description,
        "所属领域": [category, language, *topics[:2]],
        "可以做什么": [
            "体验项目提供的核心能力",
            "阅读真实开源项目的代码结构",
            "参考它的实现方式进行练习或二次开发",
        ],
        "为什么值得玩": f"这是近期受到关注的{category}项目。适合先体验功能，再结合 README 和源码理解它如何实现。",
        "适合人群": ["想体验开源工具的普通用户", "正在学习相关技术的开发者", "寻找二次开发案例的程序员"],
        "兴趣指数": "⭐⭐⭐⭐☆",
        "学习价值": "⭐⭐⭐⭐⭐",
        "难度等级": f"⭐⭐⭐ {difficulty}",
        "使用指南": {
            "安装方法": install,
            "运行方法": run,
            "普通用户": "优先查看项目主页、在线演示和 Releases；如果有安装包，普通用户不需要配置源码环境。",
            "EXE打包": "有 Releases 时优先下载作者提供的安装包。Python 桌面项目可研究 PyInstaller；网页项目通常不适合直接打成 EXE。" if has_releases else "当前元数据未显示明确安装包，需进入 Releases 或 README 再确认；不要盲目把所有项目都当作 EXE 软件。",
            "网页部署": "项目提供了主页或在线演示，可先直接体验。" if has_pages else "是否能部署为网页取决于项目是否包含前端或 Web 服务；静态网页可用 GitHub Pages，服务端项目可考虑 Render。",
            "Docker": "项目标签显示支持 Docker，可优先寻找 docker-compose.yml 或 Dockerfile。" if has_docker else "暂未从项目标签确认 Docker 支持，请在源码中查找 Dockerfile 或 docker-compose.yml。",
            "普通用户适合度": "建议先找在线演示或 Releases。只有源码、没有安装说明的项目更适合开发者。",
            "二次开发难度": f"参考难度：{difficulty}。先运行原项目，再从一个小功能开始修改，比直接重写更稳妥。",
        },
    }
