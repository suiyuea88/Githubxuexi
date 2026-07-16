(function () {
  const CACHE_KEY = "github-learning-projects-v3-cn";
  const CACHE_TTL = 30 * 60 * 1000;
  function sessionGet(key){try{return JSON.parse(sessionStorage.getItem(key)||"null")}catch{return null}}
  function sessionSet(key,value){try{sessionStorage.setItem(key,JSON.stringify(value))}catch{}}
  function rememberSearch(projects,page){const prior=page>1?(sessionGet("search:last")||[]):[],seen=new Set(),combined=[];for(const item of [...prior,...projects]){const key=item.full_name||item.url||item.name;if(!seen.has(key)){seen.add(key);combined.push(item)}}sessionSet("search:last",combined)}

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
    const chineseSummary=/(ocr|text recognition)/.test(text)?"这是一个文字识别（OCR）项目，可从图片或扫描内容中提取文字，适合文档数字化和资料整理。":/(documentation|docs|codebase|wiki)/.test(text)?"这是一个代码文档与知识库工具，可帮助生成和维护项目说明。":/(llm|large language model|glm|inference|ai model)/.test(text)?"这是一个大语言模型相关项目，主要用于本地运行、推理或优化 AI 模型。":/(agent|copilot)/.test(text)?"这是一个 AI 智能体项目，可自动执行任务、调用工具或协助编程。":/(telegram|discord|chatbot|\bbot\b)/.test(text)?"这是一个聊天机器人项目，可用于消息回复、群组管理或自动化服务。":/(scraper|crawler|spider)/.test(text)?"这是一个数据采集项目，可自动抓取和整理网页信息。":/(automation|workflow)/.test(text)?"这是一个自动化工具，可把重复操作编排成工作流，提高处理效率。":/(security|vulnerability|pentest)/.test(text)?"这是一个网络安全工具，主要用于安全检测、漏洞分析或风险排查。":category==="Web开发"?`这是一个以${language}为主的 Web 项目，可用于搭建网站或浏览器应用。`:`这是一个以${language}为主的${category}开源项目，可用于学习真实代码结构和二次开发。`;
    return {
      "一句话介绍": chineseSummary,
      "中文简介": chineseSummary,
      "原始简介": repo.description || "作者暂未提供简介",
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
      name: repo.name, full_name: repo.full_name || `${repo.owner?.login || ""}/${repo.name || ""}`, author: repo.owner?.login || "未知作者", stars: repo.stargazers_count || 0,
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

  window.fetchProjectReadme = async function (repository) {
    if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository)) throw new Error("仓库地址不完整");
    const cached=sessionGet(`readme:${repository}`);if(cached)return cached;
    const configured = String(window.GITHUB_LEARNING_API_BASE || "").replace(/\/$/, "");
    const query = encodeURIComponent(repository);
    const urls = [...new Set([...(configured ? [`${configured}/api/readme?repo=${query}`] : []), `/api/readme?repo=${query}`, `/readme?repo=${query}`])];
    for (const url of urls) {
      try {
        const payload = await fetchJson(url, 18000);
        if (payload.content){sessionSet(`readme:${repository}`,payload);return payload;}
      } catch {}
    }
    try {
      const response = await fetch(`https://api.github.com/repos/${repository}/readme`, { headers: { Accept: "application/vnd.github.raw+json" } });
      if (!response.ok) throw new Error(`${response.status}`);
      const payload={ repository, content: (await response.text()).slice(0, 100000), source: "github" };sessionSet(`readme:${repository}`,payload);return payload;
    } catch {
      throw new Error("暂时无法读取该项目 README");
    }
  };

  window.checkProjectRuntime = async function (repository) {
    if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository)) return { runnable: false, reason: "仓库地址不完整" };
    const cached=sessionGet(`runtime:${repository}`);if(cached)return cached;
    const configured = String(window.GITHUB_LEARNING_API_BASE || "").replace(/\/$/, "");
    const query = encodeURIComponent(repository);
    const urls = [...new Set([...(configured ? [`${configured}/api/runtime-check?repo=${query}`] : []), `/api/runtime-check?repo=${query}`, `/runtime-check?repo=${query}`])];
    for (const url of urls) {
      try {
        const payload = await fetchJson(url, 18000);
        if (typeof payload.runnable === "boolean"){sessionSet(`runtime:${repository}`,payload);return payload;}
      } catch {}
    }
    return { runnable: false, kind: "check-unavailable", reason: "暂时无法完成运行环境检测，为避免无限加载，已改用学习指南" };
  };

  window.diagnoseLearningError = async function (text) {
    const configured = String(window.GITHUB_LEARNING_API_BASE || "").replace(/\/$/, "");
    const urls = [...new Set([...(configured ? [`${configured}/api/diagnose`] : []), "/api/diagnose", "/diagnose"] )];
    for (const url of urls) {
      try {
        const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15000);
        const response=await fetch(url,{method:"POST",signal:controller.signal,headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify({text})});clearTimeout(timer);
        if(!response.ok)continue;const payload=await response.json();if(Array.isArray(payload.steps))return payload;
      } catch {}
    }
    throw new Error("报错诊断服务暂时不可用");
  };

  window.searchGitHubProjects = async function (query, page=1) {
    const raw=String(query||"").trim();if(raw.length<2)throw new Error("请至少输入 2 个字符");
    const aliases={"tg机器人":"telegram bot","telegram机器人":"telegram bot","电报机器人":"telegram bot","人工智能":"artificial intelligence","聊天机器人":"chatbot","爬虫":"web scraper","自动化":"automation","小程序":"mini app","翻译":"translator"};
    const normalized=aliases[raw.toLowerCase()]||raw,configured=String(window.GITHUB_LEARNING_API_BASE||"").replace(/\/$/,""),q=encodeURIComponent(raw),pageNumber=Math.min(Math.max(Number(page)||1,1),10);
    const cacheKey=`search:${normalized}:${pageNumber}`,urls=[...new Set([...(configured?[`${configured}/api/search?q=${q}&page=${pageNumber}`]:[]),`/api/search?q=${q}&page=${pageNumber}`,`/search?q=${q}&page=${pageNumber}`])];
    for(const url of urls){try{const payload=await fetchJson(url,20000);if(!payload.error&&Array.isArray(payload.projects)&&payload.projects.length){rememberSearch(payload.projects,pageNumber);sessionSet(cacheKey,payload);return {...payload,source:"backend"}}}catch{}}
    try{const payload=await fetchJson(`https://api.github.com/search/repositories?q=${encodeURIComponent(normalized)}&sort=stars&order=desc&per_page=20&page=${pageNumber}`,20000),projects=(payload.items||[]).map(normalize),total=Math.min(Number(payload.total_count)||projects.length,1000);if(!projects.length)throw new Error("empty");const result={query:raw,github_query:normalized,projects,page:pageNumber,total_count:total,has_more:pageNumber*20<total&&projects.length>0};rememberSearch(projects,pageNumber);sessionSet(cacheKey,result);return {...result,source:"github"}}catch{const cached=sessionGet(cacheKey);if(cached?.projects?.length)return {...cached,source:"cache"};throw new Error("GitHub 暂时没有返回项目，可能正在限流，请稍后重试")}
  };
  window.getLastSearchedProjects = function(){return sessionGet("search:last")||[]};
})();
