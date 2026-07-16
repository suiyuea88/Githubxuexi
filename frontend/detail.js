const box = document.getElementById("detail");
const projectName = new URLSearchParams(window.location.search).get("name");

function safe(value, fallback = "暂无") {
  const text = value === null || value === undefined || value === "" ? fallback : String(value);
  return text.replace(/[&<>'"]/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[char]);
}
function arr(value) { return Array.isArray(value) ? value : []; }

async function loadDetail() {
  if (!projectName) {
    box.innerHTML = '<div class="state-card error"><b>没有指定项目</b><p><a href="index.html">返回首页重新选择</a></p></div>';
    return;
  }
  try {
    const result = await window.fetchLearningProjects();
    const data = result.data;
    const project = data.find(item => item.name === projectName);
    if (!project) throw new Error("项目不存在或已不在今日榜单");
    render(project);
  } catch (error) {
    box.innerHTML = `<div class="state-card error"><b>详情加载失败</b><p>${safe(error.message)}</p><button onclick="loadDetail()">重新加载</button></div>`;
  }
}

function render(project) {
  const analysis = project.analysis || {};
  const guide = analysis["使用指南"] || {};
  const guideRows = [
    ["安装方法", guide["安装方法"]], ["运行方法", guide["运行方法"]],
    ["普通用户怎么用", guide["普通用户"]], ["能否打包 EXE", guide["EXE打包"] || guide["EXE"]],
    ["网页怎么部署", guide["网页部署"] || guide["网页"]], ["Docker / 一键使用", guide["Docker"]],
    ["普通用户适合度", guide["普通用户适合度"]], ["二次开发难度", guide["二次开发难度"]],
  ];
  box.innerHTML = `<article class="detail-card">
    <div class="detail-title"><div><small>开源项目学习档案</small><h1>🔥 ${safe(project.name)}</h1></div><div class="tags"><span>⭐ ${safe(project.stars, "0")}</span><span>💻 ${safe(project.language)}</span><span>👤 ${safe(project.author)}</span></div></div>
    <section><h2>🧠 它是什么？</h2><p>${safe(analysis["一句话介绍"])}</p></section>
    <section><h2>🌍 项目领域</h2><div class="detail-tags">${arr(analysis["所属领域"]).map(item => `<span>${safe(item)}</span>`).join("")}</div></section>
    <div class="detail-columns">
      <section><h2>🎮 可以做什么？</h2><ul>${arr(analysis["可以做什么"]).map(item => `<li>${safe(item)}</li>`).join("")}</ul></section>
      <section><h2>👥 适合谁？</h2><ul>${arr(analysis["适合人群"]).map(item => `<li>${safe(item)}</li>`).join("")}</ul></section>
    </div>
    <section class="guide-section"><div class="section-head"><div><small>从体验到二次开发</small><h2>📘 项目使用指南</h2></div><span>${safe(analysis["难度等级"])}</span></div>
      <div class="guide-grid">${guideRows.map(([title, content], index) => `<article><b><i>${String(index + 1).padStart(2, "0")}</i>${safe(title)}</b><p>${safe(content, "需要进入项目 README 进一步确认")}</p></article>`).join("")}</div>
    </section>
    <section class="value-section"><h2>📚 为什么值得学习？</h2><p>${safe(analysis["为什么值得玩"])}</p><div><span>兴趣指数 <b>${safe(analysis["兴趣指数"])}</b></span><span>学习价值 <b>${safe(analysis["学习价值"])}</b></span></div></section>
    <div class="detail-buttons"><a href="index.html">← 返回项目列表</a><a class="primary-link" href="${safe(project.url, "#")}" target="_blank" rel="noopener noreferrer">🚀 查看 GitHub 源码</a></div>
  </article>`;
}

loadDetail();
