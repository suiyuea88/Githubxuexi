const projectsBox = document.getElementById("projects");
let allProjects = [];

function safe(value, fallback = "暂无") {
  const text = value === null || value === undefined || value === "" ? fallback : String(value);
  return text.replace(/[&<>'"]/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[char]);
}

function arr(value) {
  return Array.isArray(value) ? value : [];
}

function getFavorites() {
  try { return JSON.parse(localStorage.getItem("favorites") || "[]"); }
  catch { return []; }
}

async function loadProjects() {
  projectsBox.innerHTML = '<div class="state-card"><b>正在加载今日热门项目…</b><p>Render 免费服务首次打开可能需要等待几十秒。</p></div>';
  try {
    const result = await window.fetchLearningProjects();
    const data = result.data;
    allProjects = data;
    renderProjects(data);
    updateRecommend(data[0]);
    document.body.dataset.dataSource = result.source;
  } catch (error) {
    projectsBox.innerHTML = `<div class="state-card error"><b>项目加载失败</b><p>${safe(error.message, "请稍后重试")}</p><button onclick="loadProjects()">重新加载</button></div>`;
  }
}

function updateRecommend(project) {
  if (!project) return;
  const analysis = project.analysis || {};
  document.getElementById("hero-title").textContent = `🔥 ${project.name || "今日推荐"}`;
  document.getElementById("hero-desc").textContent = analysis["一句话介绍"] || "发现值得学习的开源项目";
}

function renderProjects(data) {
  projectsBox.innerHTML = "";
  if (!data.length) {
    projectsBox.innerHTML = '<div class="state-card"><b>这个分类暂时没有项目</b><p>可以选择“全部”查看今日列表。</p></div>';
    return;
  }
  const favorites = getFavorites();
  data.forEach(project => {
    const analysis = project.analysis || {};
    const fields = arr(analysis["所属领域"]);
    const play = arr(analysis["可以做什么"]);
    const isFavorite = favorites.includes(project.name);
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <h2>🔥 ${safe(project.name)}</h2>
      <div class="tags">
        <span>⭐ ${safe(project.stars, "0")}</span><span>💻 ${safe(project.language)}</span>
        ${fields.slice(0, 2).map(item => `<span>${safe(item)}</span>`).join("")}
      </div>
      <h3>🧠 项目是什么？</h3><p>${safe(analysis["一句话介绍"])}</p>
      <h3>🚀 怎么玩？</h3><p>${play.slice(0, 2).map(item => `✅ ${safe(item)}`).join("<br>") || "进入详情查看完整使用指南"}</p>
      <div class="card-buttons">
        <a href="detail.html?name=${encodeURIComponent(project.name || "")}">📖 详情</a>
        <a href="${safe(project.url, "#")}" target="_blank" rel="noopener noreferrer">🚀 源码</a>
        <button class="${isFavorite ? "saved" : ""}" data-project="${safe(project.name)}" onclick="favoriteProject(this)">${isFavorite ? "✓ 已收藏" : "⭐ 收藏"}</button>
      </div>`;
    projectsBox.appendChild(card);
  });
}

function filterCategory(type) {
  const keyword = type.toLowerCase();
  const aliases = { "ai": ["人工智能", "ai"], "工具": ["开发工具", "工具"], "创意": ["创意", "开源项目"] };
  const words = aliases[keyword] || [keyword];
  const result = allProjects.filter(project => arr(project.analysis?.["所属领域"]).some(field => words.some(word => String(field).toLowerCase().includes(word))));
  renderProjects(result);
  document.getElementById("projects").scrollIntoView({ behavior: "smooth", block: "start" });
}

function showAll() { renderProjects(allProjects); }
function scrollProjects() { document.getElementById("projects").scrollIntoView({ behavior: "smooth" }); }

function favoriteProject(button) {
  const name = button.dataset.project;
  const favorites = getFavorites();
  const index = favorites.indexOf(name);
  if (index >= 0) {
    favorites.splice(index, 1);
    button.textContent = "⭐ 收藏";
    button.classList.remove("saved");
  } else {
    favorites.push(name);
    button.textContent = "✓ 已收藏";
    button.classList.add("saved");
  }
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

loadProjects();
