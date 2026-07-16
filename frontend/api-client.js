(function () {
  const CACHE_KEY = "github-learning-projects-v2";
  const CACHE_TTL = 30 * 60 * 1000;

  function apiCandidates() {
    const configured = String(window.GITHUB_LEARNING_API_BASE || "").replace(/\/$/, "");
    const candidates = configured ? [`${configured}/projects`] : [];
    candidates.push("/projects", "/api/projects");
    return [...new Set(candidates)];
  }

  async function fetchJson(url, timeout = 12000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(url, { signal: controller.signal, headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error(`${response.status}`);
      return await response.json();
    } finally {
      clearTimeout(timer);
    }
  }

  function guideFor(language, homepage) {
    const node = ["JavaScript", "TypeScript"].includes(language);
    const python = language === "Python";
    return {
      "安装方法": node ? "安装 Node.js 后，在项目目录执行 npm install。" : python ? "安装 Python 后，在项目目录执行 pip install -r requirements.txt。" : "先阅读项目 README，并按依赖文件准备运行环境。",
      "运行方法": node ? "通常执行 npm run dev；正式运行前执行 npm run build。" : python ? "通常执行 python main.py，具体入口以 README 为准。" : "按照 README 中的 Quick Start 或 Usage 步骤启动。",
      "普通用户": homepage ? "项目提供了在线主页，建议先打开在线版本体验，再决定是否下载源码。" : "优先检查 Releases 是否有安装包；只有源码时更适合有基础的用户。",
      "EXE打包": python ? "桌面型 Python 项目可尝试 PyInstaller；服务端项目不建议强行打包成 EXE。" : "先查看 Releases。网页项目通常通过浏览器访问，不需要打包成 EXE。",
      "网页部署": homepage ? "已有项目主页，可先直接体验。二次部署仍需以 README 为准。" : "静态页面可用 GitHub Pages；带服务端的项目可使用 Render、Railway 或 Docker。",
      "Docker": "在项目根目录查找 Dockerfile 或 docker-compose.yml；存在时优先按作者命令部署。",
      "普通用户适合度": homepage ? "较适合普通用户先在线体验。" : "需要先阅读 README；若没有 Releases，使用门槛相对较高。",
      "二次开发难度": ["HTML", "CSS"].includes(language) ? "入门：适合从界面和小功能开始修改。" : "中等：建议先完整运行原项目，再逐步修改一个功能。",
    };
  }

  function analyze(repo) {
    const language = repo.language || "多语言";
    const text = `${repo.description || ""} ${(repo.topics || []).join(" ")}`.toLowerCase();
    const category = /(ai|llm|agent|model|machine-learning)/.test(text) ? "人工智能" : /(web|frontend|website|browser)/.test(text) ? "Web开发" : language === "Python" ? "Python项目" : "开源项目";
    return {
      "一句话介绍": repo.description || "作者暂未提供简介，建议进入 README 查看完整说明。",
      "所属领域": [category, language, ...(repo.topics || []).slice(0, 2)],
      "可以做什么": ["体验项目的核心功能", "阅读真实开源项目的目录和代码", "参考实现方式进行练习或二次开发"],
      "为什么值得玩": `这是近期受到关注的${category}项目，可先体验功能，再通过 README 和源码理解实现方法。`,
      "适合人群": ["想体验开源工具的普通用户", "正在学习相关技术的开发者", "寻找二次开发案例的程序员"],
      "兴趣指数": "⭐⭐⭐⭐☆", "学习价值": "⭐⭐⭐⭐⭐", "难度等级": "⭐⭐⭐ 中等",
      "使用指南": guideFor(language, repo.homepage),
    };
  }

  function normalize(repo) {
    return {
      name: repo.name, author: repo.owner?.login || "未知作者", stars: repo.stargazers_count || 0,
      language: repo.language || "多语言", url: repo.html_url, homepage: repo.homepage || "",
      updated_at: repo.updated_at, analysis: analyze(repo),
    };
  }

  function readCache() {
    try {
      const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
      return cache && Date.now() - cache.time < CACHE_TTL && Array.isArray(cache.data) ? cache.data : null;
    } catch { return null; }
  }

  function saveCache(data) {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify({ time: Date.now(), data })); } catch {}
  }

  async function githubFallback() {
    const since = new Date(Date.now() - 14 * 86400000).toISOString().slice(0, 10);
    const url = `https://api.github.com/search/repositories?q=created:%3E${since}+stars:%3E20&sort=stars&order=desc&per_page=12`;
    const payload = await fetchJson(url, 18000);
    const data = (payload.items || []).map(normalize);
    if (!data.length) throw new Error("GitHub 暂未返回项目数据");
    return data;
  }

  window.fetchLearningProjects = async function () {
    const errors = [];
    for (const url of apiCandidates()) {
      try {
        const payload = await fetchJson(url);
        const data = Array.isArray(payload) ? payload : payload.projects;
        if (Array.isArray(data) && data.length) { saveCache(data); return { data, source: "backend" }; }
        errors.push(`${url}: empty`);
      } catch (error) { errors.push(`${url}: ${error.message}`); }
    }
    const cached = readCache();
    if (cached) return { data: cached, source: "cache" };
    try {
      const data = await githubFallback();
      saveCache(data);
      return { data, source: "github" };
    } catch (error) {
      throw new Error(`数据连接失败，请稍后重试（${error.message}）`);
    }
  };

  window.translateLearningText = async function (text) {
    const configured = String(window.GITHUB_LEARNING_API_BASE || "").replace(/\/$/, "");
    const urls = [...new Set([...(configured ? [`${configured}/api/translate`] : []), "/api/translate", "/translate"] )];
    for (const url of urls) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 20000);
        const response = await fetch(url, { method: "POST", signal: controller.signal, headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ text }) });
        clearTimeout(timer);
        if (!response.ok) continue;
        const payload = await response.json();
        if (payload.translation) return payload;
      } catch {}
    }
    throw new Error("翻译后端暂时不可用，请确认 Render Web Service 已启动");
  };
})();
