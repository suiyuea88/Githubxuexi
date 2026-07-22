const projectsBox = document.getElementById("projects");
let allProjects = [], todayProjects = [], activeProject = null, activeLabTab = "preview", activeReadme = "", labSessionTimer = null, searchTimer = null, searchSequence = 0, currentSearchQuery = "", currentSearchPage = 1, searchHasMore = false;
const STUDY_KEY = "github-learning-progress-v1";

function safe(value, fallback = "暂无") { const text=value??fallback; return String(text||fallback).replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[c]); }
function safeUrl(value){try{const u=new URL(String(value||""),window.location.href);return ["http:","https:"].includes(u.protocol)?safe(u.href):"#"}catch{return "#"}}
function arr(value) { return Array.isArray(value) ? value : []; }
function starCount(project) {
  const value = project?.stars;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const text = String(value ?? "0").trim().toLowerCase().replace(/,/g, "");
  const number = Number.parseFloat(text) || 0;
  return text.endsWith("k") ? number * 1000 : text.endsWith("m") ? number * 1000000 : number;
}
function sortByStars(data) { return [...arr(data)].sort((a, b) => starCount(b) - starCount(a)); }
function getFavorites() { try{return JSON.parse(localStorage.getItem("favorites")||"[]")}catch{return[]} }
function getStudyState(){try{return JSON.parse(localStorage.getItem(STUDY_KEY)||'{"projects":{}}')}catch{return {projects:{}}}}
function saveStudyState(state){localStorage.setItem(STUDY_KEY,JSON.stringify(state))}
function projectProgress(name){const item=getStudyState().projects?.[name]||{},steps=item.steps||{},done=Object.values(steps).filter(Boolean).length;return {item,done,total:8,percent:Math.min(100,Math.round(done/8*100))}}
function recordProjectVisit(project){const state=getStudyState();state.projects=state.projects||{};const old=state.projects[project.name]||{};state.projects[project.name]={...old,name:project.name,language:project.language||"多语言",url:project.url||"",viewedAt:Date.now(),steps:old.steps||{}};saveStudyState(state)}
function toggleStudyStep(step,checked){if(!activeProject)return;const state=getStudyState();state.projects=state.projects||{};const old=state.projects[activeProject.name]||{name:activeProject.name,language:activeProject.language||"多语言",url:activeProject.url||"",viewedAt:Date.now(),steps:{}};old.steps={...(old.steps||{}),[step]:checked};old.updatedAt=Date.now();state.projects[activeProject.name]=old;saveStudyState(state)}

async function loadProjects(){
  projectsBox.innerHTML='<div class="state-card"><b>正在打开今日项目册…</b><p>首次连接可能需要一点时间。</p></div>';
  try{const result=await window.fetchLearningProjects();todayProjects=sortByStars(result.data);allProjects=[...todayProjects];renderProjects(allProjects);updateRecommend(allProjects[0]);document.body.dataset.dataSource=result.source;}
  catch(error){projectsBox.innerHTML=`<div class="state-card error"><b>项目册暂时打不开</b><p>${safe(error.message)}</p><button onclick="loadProjects()">重新连接</button></div>`}
}

function updateRecommend(project){if(!project)return;const a=project.analysis||{};document.getElementById("hero-title").innerHTML=`今日研习<br><em>${safe(project.name)}</em>`;document.getElementById("hero-desc").textContent=a["一句话介绍"]||"发现值得学习的开源项目";}

function renderProjects(data){
  data=sortByStars(data);
  projectsBox.innerHTML="";
  if(!data.length){projectsBox.innerHTML='<div class="state-card"><b>这一册还没有项目</b><p>换一个分类，或先收藏感兴趣的项目。</p></div>';return;}
  const favorites=getFavorites();
  data.forEach((project,index)=>{const a=project.analysis||{},fields=arr(a["所属领域"]),isFav=favorites.includes(project.name),card=document.createElement("article");card.className="project-scroll";card.innerHTML=`
    <div class="scroll-index"><span>${String(index+1).padStart(2,"0")}</span><small>${safe(project.language,"多语言")}</small></div>
    <div class="scroll-content"><div class="project-title"><div><small>${safe(fields[0],"开源项目")}</small><h3>${safe(project.name)}</h3></div><span>⭐ ${safe(project.stars,"0")}</span></div>
      <p>${safe(a["一句话介绍"],"进入项目详情，了解它能做什么。")}</p>
      <div class="project-tags">${fields.slice(0,3).map(x=>`<span>${safe(x)}</span>`).join("")}</div>
      <div class="study-actions"><button class="lab-open" data-name="${safe(project.name)}" onclick="openLabByButton(this)">${canRunInBrowser(project)?"检测运行":"学习指南"}</button><a href="detail.html?name=${encodeURIComponent(project.name||"")}">详解</a><a href="${safeUrl(project.url)}" target="_blank" rel="noopener noreferrer">源码</a><button class="favorite ${isFav?"saved":""}" data-project="${safe(project.name)}" onclick="favoriteProject(this)">${isFav?"已藏":"收藏"}</button></div>
    </div>`;projectsBox.appendChild(card);});
}

function findProject(name){return allProjects.find(p=>p.name===name)}
function repositorySlug(project){if(project.full_name&&project.full_name.includes("/"))return project.full_name;const match=String(project.url||"").match(/github\.com\/([^/]+\/[^/#?]+)/i);return match?match[1].replace(/\.git$/i,""):""}
function canRunInBrowser(project){const language=String(project.language||"").toLowerCase(),fields=arr(project.analysis?.["所属领域"]).join(" ").toLowerCase();return ["javascript","typescript","html","css","vue","svelte"].includes(language)||fields.includes("web")}
function stackBlitzUrl(project){const slug=repositorySlug(project);return slug?`https://stackblitz.com/github/${encodeURI(slug)}?embed=1&hideNavigation=1&view=preview`:""}
const CATEGORY_QUERIES={AI:"topic:artificial-intelligence",Python:"language:python",Web:"topic:web",工具:"topic:developer-tools",自动化:"topic:automation",机器人:"topic:bot",数据:"topic:data-science",移动:"mobile app",安全:"topic:cybersecurity",游戏:"topic:game-development"};
function filterCategory(type){const query=CATEGORY_QUERIES[type]||type,input=document.getElementById("project-search");input.value=type;runGlobalSearch(query,1,false,type);scrollProjects();}
function showAll(){allProjects=[...todayProjects];renderProjects(allProjects);setCollectionNote("GitHub 历史高星项目 · 按 Star 总数从高到低");scrollProjects();}
function showFavorites(){const fav=getFavorites(),data=sortByStars(allProjects.filter(p=>fav.includes(p.name)));renderProjects(data);setCollectionNote(`我的收藏 · ${data.length} 个待研习项目 · 按 Star 从高到低`);scrollProjects();}
function scheduleProjectSearch(value){clearTimeout(searchTimer);const query=String(value||"").trim();if(!query){clearProjectSearch(false);return}if(query.length<2){setCollectionNote("请至少输入 2 个字符");return}searchTimer=setTimeout(()=>runGlobalSearch(query),550)}
async function runGlobalSearch(value,page=1,append=false,label=""){const query=String(value||"").trim();if(query.length<2)return;const requestedPage=Math.min(Math.max(Number(page)||1,1),10),sequence=++searchSequence;currentSearchQuery=query;if(!append){setCollectionNote(`正在 GitHub 全站查询${label?`“${label}”分类`:`“${query}”`}…`);projectsBox.innerHTML='<div class="state-card search-loading"><b>正在打开 GitHub 项目库…</b><p>每个分类默认展示 20 个热门项目，并可继续加载。</p></div>'}else setLoadMoreState("正在加载更多…",true);try{const result=await window.searchGitHubProjects(query,requestedPage);if(sequence!==searchSequence)return;const incoming=sortByStars(result.projects||[]);currentSearchPage=requestedPage;if(append){const seen=new Set(allProjects.map(p=>p.full_name||p.url||p.name));allProjects=sortByStars([...allProjects,...incoming.filter(p=>!seen.has(p.full_name||p.url||p.name))])}else allProjects=incoming;searchHasMore=Boolean(result.has_more);renderProjects(allProjects);if(searchHasMore)addLoadMoreButton();const title=label||value,converted=result.github_query&&result.github_query.toLowerCase()!==query.toLowerCase()?` · 已识别为“${result.github_query}”`:"";setCollectionNote(`${label?`${title} 分类`:`搜索“${title}”`} · 已显示 ${allProjects.length} / ${result.total_count||allProjects.length} 个项目 · 按 Star 从高到低${converted}`)}catch(error){if(sequence!==searchSequence)return;if(append)addLoadMoreButton("加载失败，点击重试",requestedPage);else projectsBox.innerHTML=`<div class="state-card error"><b>GitHub 查询失败</b><p>${safe(error.message)}</p><button onclick="runGlobalSearch(currentSearchQuery)">重新加载</button></div>`}}
function addLoadMoreButton(label="加载更多 GitHub 项目",page=currentSearchPage+1){const wrap=document.createElement("div");wrap.className="load-more-wrap";wrap.innerHTML=`<button onclick="runGlobalSearch(currentSearchQuery,${Number(page)},true)">${label}</button>`;projectsBox.appendChild(wrap)}
function setLoadMoreState(label,disabled=false){const button=document.querySelector(".load-more-wrap button");if(button){button.textContent=label;button.disabled=disabled}}
function clearProjectSearch(focus=true){clearTimeout(searchTimer);searchSequence++;currentSearchQuery="";currentSearchPage=1;searchHasMore=false;const input=document.getElementById("project-search");input.value="";allProjects=[...todayProjects];renderProjects(allProjects);setCollectionNote("GitHub 历史高星项目 · 按 Star 总数从高到低");if(focus)input.focus()}
function setCollectionNote(text){document.getElementById("collection-note").textContent=text;}
function scrollProjects(){document.getElementById("collection").scrollIntoView({behavior:"smooth"});}
function toggleMobileMenu(force){const el=document.getElementById("mobile-menu");el.classList.toggle("open",typeof force==="boolean"?force:undefined)}

function favoriteProject(button){const name=button.dataset.project,f=getFavorites(),i=f.indexOf(name);if(i>=0){f.splice(i,1);button.textContent="收藏";button.classList.remove("saved")}else{f.push(name);button.textContent="已藏";button.classList.add("saved")}localStorage.setItem("favorites",JSON.stringify(f));}

function openFirstLab(){if(allProjects[0])openLab(allProjects[0]);else scrollProjects()}
function openLabByButton(button){const p=findProject(button.dataset.name);if(p)openLab(p)}
function openLab(project){activeProject=project;recordProjectVisit(project);activeReadme="";activeLabTab="preview";clearTimeout(labSessionTimer);document.getElementById("lab-title").textContent=project.name;document.querySelectorAll(".lab-tabs button").forEach(b=>b.classList.toggle("active",b.dataset.tab==="preview"));document.getElementById("lab").hidden=false;document.body.classList.add("modal-open");renderLab();labSessionTimer=setTimeout(closeLab,10*60*1000);}
function closeLab(){clearTimeout(labSessionTimer);document.getElementById("lab").hidden=true;document.getElementById("lab-body").replaceChildren();activeProject=null;activeReadme="";document.body.classList.remove("modal-open");}
function switchLabTab(button){activeLabTab=button.dataset.tab;document.querySelectorAll(".lab-tabs button").forEach(b=>b.classList.toggle("active",b===button));renderLab();}
function renderLab(){
  const p=activeProject,a=p.analysis||{},guide=a["使用指南"]||{},body=document.getElementById("lab-body"),progress=projectProgress(p.name);
  if(activeLabTab==="preview"){
    renderRuntimePreview(p,body);
  }else if(activeLabTab==="readme"){
    renderReadmeGuide(p,body);
  }else if(activeLabTab==="guide"){
    const rows=[["第一步 · 准备环境",guide["安装方法"]],["第二步 · 启动项目",guide["运行方法"]],["第三步 · 尝试部署",guide["网页部署"]],["进阶 · 二次开发",guide["二次开发难度"]]];
    body.innerHTML=`<div class="guide-progress"><span>当前学习进度 <b>${progress.percent}%</b></span><i><em style="width:${progress.percent}%"></em></i></div><div class="guide-workbench">${rows.map((r,i)=>`<article><input type="checkbox" id="task-${i}" ${progress.item.steps?.[`guide-${i}`]?"checked":""} onchange="toggleStudyStep('guide-${i}',this.checked)"><label for="task-${i}"><small>${r[0]}</small><b>${safe(r[1],"请进入 README 查看作者说明")}</b></label></article>`).join("")}<div class="lab-links"><a href="${safeUrl(p.url)}" target="_blank" rel="noopener noreferrer">打开 README / 源码</a>${p.homepage?`<a href="${safeUrl(p.homepage)}" target="_blank" rel="noopener noreferrer">打开项目官网</a>`:""}</div></div>`;
  }else{
    const key=`study-note:${p.name}`,note=localStorage.getItem(key)||"";body.innerHTML=`<div class="notes-panel"><label>我的研习笔记 <small>自动保存在当前浏览器</small></label><textarea id="study-note" placeholder="例如：这个项目解决了什么问题？我成功运行到哪一步？下一次准备修改什么？">${safe(note,"")}</textarea><div><button onclick="saveStudyNote()">保存笔记</button><span id="note-status"></span></div></div>`;
  }
}

async function renderRuntimePreview(project,body){
  const slug=repositorySlug(project);
  if(!slug){body.innerHTML='<div class="no-preview"><span>检</span><h3>无法检测运行环境</h3><p>项目仓库地址不完整，已改用学习指南。</p></div>';return}
  body.innerHTML='<div class="runtime-checking"><span>检</span><b>正在检查仓库是否真的可运行…</b><p>检查 package.json、启动脚本和前端入口，避免卡在无限导入。</p></div>';
  const check=await window.checkProjectRuntime(slug);if(!activeProject||activeProject.name!==project.name||activeLabTab!=="preview")return;
  if(!check.runnable){
    if(project.homepage){body.innerHTML=`<div class="preview-notice"><b>不支持源码在线运行</b><span>${safe(check.reason)}。下方只展示作者已部署的效果。</span><a href="${safeUrl(project.homepage)}" target="_blank" rel="noopener noreferrer">新窗口查看</a></div><iframe class="project-frame" src="${safeUrl(project.homepage)}" title="${safe(project.name)} 效果预览" sandbox="allow-forms allow-scripts allow-same-origin allow-popups"></iframe>`;return}
    body.innerHTML=`<div class="no-preview runtime-rejected"><span>学</span><h3>检测结果：不是可直接启动的网页项目</h3><p>${safe(check.reason)}。它可能是 Skill、CLI、后端、桌面软件或代码素材，不应继续等待 StackBlitz 导入。</p><button onclick="document.querySelector('[data-tab=readme]').click()">进入 README 导学</button><a href="${safeUrl(project.url)}" target="_blank" rel="noopener noreferrer">打开源码仓库</a></div>`;return
  }
  const runner=stackBlitzUrl(project);body.innerHTML=`<div class="preview-notice"><b>已通过运行检测</b><span>${safe(check.reason)}。现在由 StackBlitz 临时导入，不占用本站 Render 资源。</span><a href="${safeUrl(runner.split("?")[0])}" target="_blank" rel="noopener noreferrer">新窗口运行</a></div><div class="runtime-slow" id="runtime-slow" hidden><b>导入超过 35 秒？</b><span>当前仓库可能较大，或浏览器限制了第三方运行环境。</span><a href="${safeUrl(runner.split("?")[0])}" target="_blank" rel="noopener noreferrer">改用新窗口</a><button onclick="document.querySelector('[data-tab=readme]').click()">改看导学</button></div><iframe class="project-frame" src="${safeUrl(runner)}" title="${safe(project.name)} 浏览器运行" sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-modals allow-downloads"></iframe>`;
  setTimeout(()=>{if(activeProject?.name===project.name&&activeLabTab==="preview"){const warning=document.getElementById("runtime-slow");if(warning)warning.hidden=false}},35000);
}

async function renderReadmeGuide(project,body){
  const slug=repositorySlug(project),analysis=project.analysis||{},guide=analysis["使用指南"]||{},progress=projectProgress(project.name);
  if(!slug){body.innerHTML='<div class="no-preview"><span>读</span><h3>无法识别仓库地址</h3><p>请先通过源码入口查看 README。</p></div>';return}
  body.innerHTML='<div class="readme-loading"><b>正在读取 README…</b><p>读取后会自动整理成小白学习步骤。</p></div>';
  try{
    const result=await window.fetchProjectReadme(slug);if(!activeProject||activeProject.name!==project.name)return;activeReadme=result.content||"";
    const commands=[...activeReadme.matchAll(/```[^\n]*\n([\s\S]*?)```/g)].map(x=>x[1].trim()).filter(Boolean).slice(0,6);
    const headings=[...activeReadme.matchAll(/^#{1,3}\s+(.+)$/gm)].map(x=>x[1].replace(/[*_`]/g,"").trim()).slice(0,12);
    const excerpt=activeReadme.replace(/!\[[^\]]*\]\([^)]*\)/g,"").replace(/<[^>]+>/g,"").slice(0,6000);
    const language=safe(project.language,"多语言");
    body.innerHTML=`<div class="readme-guide">
      <section class="readme-overview"><span>01</span><div><small>先看懂项目</small><h3>${safe(project.name)}</h3><p>${safe(analysis["一句话介绍"],"请结合 README 了解项目用途。")}</p></div></section>
      <div class="readme-columns"><article><b>02 · 运行前准备</b><p>${safe(guide["安装方法"],`需要先准备 ${language} 环境。`)}</p></article><article><b>03 · 首次启动</b><p>${safe(guide["运行方法"],"以 README 中的 Quick Start 为准。")}</p></article></div>
      <section class="readme-commands"><b>04 · README 里找到的命令</b>${commands.length?commands.map((x,i)=>`<div><span>${i+1}</span><pre><code>${safe(x)}</code></pre><button onclick="copyCommand(this)">复制</button></div>`).join(""):'<p>没有识别到代码块，请查看原始 README 的 Installation 或 Usage 部分。</p>'}</section>
      <section class="readme-map"><b>README 目录导航</b><div>${headings.map(x=>`<span>${safe(x)}</span>`).join("")||'<span>未识别到标题</span>'}</div></section>
      <section class="beginner-tasks"><b>05 · 建议练习</b>${["用自己的话说明项目解决什么问题","按顺序完成环境、安装、启动","记录第一个报错及解决方法","找到一个可以尝试修改的小功能"].map((task,i)=>`<label><input type="checkbox" ${progress.item.steps?.[`readme-${i}`]?"checked":""} onchange="toggleStudyStep('readme-${i}',this.checked)"> ${task}</label>`).join("")}</section>
      <div class="readme-actions"><button data-readme="${safe(excerpt)}" onclick="sendReadmeToTranslator(this)">把英文节选送去翻译</button><a href="${safeUrl(project.url)}#readme" target="_blank" rel="noopener noreferrer">查看完整 README</a></div>
    </div>`;
  }catch(error){body.innerHTML=`<div class="no-preview"><span>读</span><h3>README 读取失败</h3><p>${safe(error.message)}</p><a href="${safeUrl(project.url)}#readme" target="_blank" rel="noopener noreferrer">去 GitHub 查看</a></div>`}
}
function copyCommand(button){const text=button.previousElementSibling.textContent;navigator.clipboard?.writeText(text);button.textContent="已复制";setTimeout(()=>button.textContent="复制",1200)}
function sendReadmeToTranslator(button){const text=button.dataset.readme||activeReadme.slice(0,6000);closeLab();openTranslator();document.getElementById("translate-source").value=text;document.getElementById("translate-count").textContent=`${text.length} / 8000`;}
function saveStudyNote(){const value=document.getElementById("study-note").value;localStorage.setItem(`study-note:${activeProject.name}`,value);document.getElementById("note-status").textContent="已保存";}

function openTranslator(){document.getElementById("translator").hidden=false;document.body.classList.add("modal-open");setTimeout(()=>document.getElementById("translate-source").focus(),30)}
function closeTranslator(){clearTranslation();document.getElementById("translator").hidden=true;document.body.classList.remove("modal-open")}
function clearTranslation(){document.getElementById("translate-source").value="";document.getElementById("translate-count").textContent="0 / 8000";document.getElementById("translation-result").innerHTML='<div class="translation-empty">选择“英文翻译”或“报错诊断”，这里会显示小白可理解的结果。</div>'}
async function runTranslation(){const source=document.getElementById("translate-source").value.trim(),box=document.getElementById("translation-result");if(!source){box.innerHTML='<div class="translation-empty error-text">请先粘贴需要翻译的英文。</div>';return}if(source.length>6000){box.innerHTML='<div class="translation-empty error-text">英文翻译单次最多 6000 字符；报错诊断可以处理 8000 字符。</div>';return}box.innerHTML='<div class="translation-empty">正在理解并翻译…</div>';try{const result=await window.translateLearningText(source);box.innerHTML=`<article class="translated-copy">${safe(result.translation).replace(/\n/g,"<br>")}</article>${arr(result.glossary).length?`<div class="glossary"><b>本段开源术语</b>${result.glossary.map(x=>`<span><code>${safe(x.term)}</code>${safe(x.meaning)}</span>`).join("")}</div>`:""}`}catch(error){box.innerHTML=`<div class="translation-empty error-text">${safe(error.message)}</div>`}}
async function runDiagnosis(){const source=document.getElementById("translate-source").value.trim(),box=document.getElementById("translation-result");if(!source){box.innerHTML='<div class="translation-empty error-text">请粘贴完整报错，最好包含执行命令和 Error 前后内容。</div>';return}box.innerHTML='<div class="translation-empty">正在匹配常见原因和处理顺序…</div>';try{const result=await window.diagnoseLearningError(source);box.innerHTML=`<div class="diagnosis-result"><span>${result.matched?"已匹配常见问题":"需要进一步排查"}</span><h3>${safe(result.title)}</h3>${result.evidence?`<blockquote>${safe(result.evidence)}</blockquote>`:""}<b>建议按这个顺序处理</b><ol>${arr(result.steps).map(x=>`<li>${safe(x)}</li>`).join("")}</ol><div><strong>安全提醒</strong><p>${safe(result.caution)}</p></div></div>`}catch(error){box.innerHTML=`<div class="translation-empty error-text">${safe(error.message)}</div>`}}

function openLearningCenter(){renderLearningCenter();document.getElementById("learning-center").hidden=false;document.body.classList.add("modal-open")}
function closeLearningCenter(){document.getElementById("learning-center").hidden=true;document.body.classList.remove("modal-open")}
function renderLearningCenter(){
  const state=getStudyState(),items=Object.values(state.projects||{}).sort((a,b)=>(b.updatedAt||b.viewedAt||0)-(a.updatedAt||a.viewedAt||0)),favorites=getFavorites();
  const completed=items.reduce((sum,x)=>sum+Object.values(x.steps||{}).filter(Boolean).length,0),notes=items.filter(x=>localStorage.getItem(`study-note:${x.name}`)?.trim()).length,percent=items.length?Math.min(100,Math.round(completed/(items.length*8)*100)):0;
  const stages=[{title:"读懂项目",desc:"会用一句话说明它解决什么问题",done:items.length>0},{title:"看懂 README",desc:"识别安装、Usage 和环境要求",done:items.some(x=>x.steps?.["readme-0"])},{title:"成功运行",desc:"按步骤完成安装并看到结果",done:items.some(x=>x.steps?.["guide-1"]||x.steps?.["readme-1"])},{title:"解决报错",desc:"记录一次真实问题与解法",done:items.some(x=>x.steps?.["readme-2"])},{title:"完成小修改",desc:"修改一个文字、样式或小功能",done:items.some(x=>x.steps?.["readme-3"])}];
  document.getElementById("learning-center-body").innerHTML=`<div class="study-summary"><article><strong>${items.length}</strong><span>已看项目</span></article><article><strong>${favorites.length}</strong><span>收藏项目</span></article><article><strong>${completed}</strong><span>完成步骤</span></article><article><strong>${notes}</strong><span>学习笔记</span></article></div>
    <div class="overall-progress"><span>总体研习进度 <b>${percent}%</b></span><i><em style="width:${percent}%"></em></i></div>
    <section class="learning-roadmap"><h3>小白学习路线</h3>${stages.map((x,i)=>`<article class="${x.done?"done":""}"><span>${x.done?"✓":i+1}</span><div><b>${x.title}</b><small>${x.desc}</small></div></article>`).join("")}</section>
    <section class="recent-learning"><h3>最近研习</h3>${items.length?items.slice(0,8).map(x=>{const p=projectProgress(x.name),available=allProjects.some(a=>a.name===x.name);return `<article><div><b>${safe(x.name)}</b><small>${safe(x.language)} · ${new Date(x.updatedAt||x.viewedAt).toLocaleDateString("zh-CN")}</small></div><i><em style="width:${p.percent}%"></em></i><span>${p.percent}%</span>${available?`<button data-name="${safe(x.name)}" onclick="resumeProject(this)">继续</button>`:`<a href="${safeUrl(x.url)}" target="_blank" rel="noopener noreferrer">源码</a>`}</article>`}).join(""):'<div class="learning-empty">还没有研习记录。打开一个项目的研习台，从 README 导学开始。</div>'}</section>`;
}
function resumeProject(button){const project=findProject(button.dataset.name);if(!project)return;closeLearningCenter();openLab(project)}
function clearLearningProgress(){if(!confirm("确定清除所有学习步骤记录吗？收藏和笔记不会删除。"))return;localStorage.removeItem(STUDY_KEY);renderLearningCenter()}
document.getElementById("translate-source").addEventListener("input",e=>document.getElementById("translate-count").textContent=`${e.target.value.length} / 8000`);
document.addEventListener("keydown",e=>{if(e.key!=="Escape")return;if(!document.getElementById("learning-center").hidden)closeLearningCenter();else if(!document.getElementById("translator").hidden)closeTranslator();else if(!document.getElementById("lab").hidden)closeLab()});
loadProjects();
