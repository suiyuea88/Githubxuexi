const projectsBox = document.getElementById("projects");
let allProjects = [], activeProject = null, activeLabTab = "preview", labSessionTimer = null;

function safe(value, fallback = "暂无") { const text=value??fallback; return String(text||fallback).replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[c]); }
function safeUrl(value){try{const u=new URL(String(value||""),window.location.href);return ["http:","https:"].includes(u.protocol)?safe(u.href):"#"}catch{return "#"}}
function arr(value) { return Array.isArray(value) ? value : []; }
function getFavorites() { try{return JSON.parse(localStorage.getItem("favorites")||"[]")}catch{return[]} }

async function loadProjects(){
  projectsBox.innerHTML='<div class="state-card"><b>正在打开今日项目册…</b><p>首次连接可能需要一点时间。</p></div>';
  try{const result=await window.fetchLearningProjects();allProjects=result.data;renderProjects(allProjects);updateRecommend(allProjects[0]);document.body.dataset.dataSource=result.source;}
  catch(error){projectsBox.innerHTML=`<div class="state-card error"><b>项目册暂时打不开</b><p>${safe(error.message)}</p><button onclick="loadProjects()">重新连接</button></div>`}
}

function updateRecommend(project){if(!project)return;const a=project.analysis||{};document.getElementById("hero-title").innerHTML=`今日研习<br><em>${safe(project.name)}</em>`;document.getElementById("hero-desc").textContent=a["一句话介绍"]||"发现值得学习的开源项目";}

function renderProjects(data){
  projectsBox.innerHTML="";
  if(!data.length){projectsBox.innerHTML='<div class="state-card"><b>这一册还没有项目</b><p>换一个分类，或先收藏感兴趣的项目。</p></div>';return;}
  const favorites=getFavorites();
  data.forEach((project,index)=>{const a=project.analysis||{},fields=arr(a["所属领域"]),isFav=favorites.includes(project.name),card=document.createElement("article");card.className="project-scroll";card.innerHTML=`
    <div class="scroll-index"><span>${String(index+1).padStart(2,"0")}</span><small>${safe(project.language,"多语言")}</small></div>
    <div class="scroll-content"><div class="project-title"><div><small>${safe(fields[0],"开源项目")}</small><h3>${safe(project.name)}</h3></div><span>⭐ ${safe(project.stars,"0")}</span></div>
      <p>${safe(a["一句话介绍"],"进入项目详情，了解它能做什么。")}</p>
      <div class="project-tags">${fields.slice(0,3).map(x=>`<span>${safe(x)}</span>`).join("")}</div>
      <div class="study-actions"><button class="lab-open" data-name="${safe(project.name)}" onclick="openLabByButton(this)">研习台</button><a href="detail.html?name=${encodeURIComponent(project.name||"")}">详解</a><a href="${safeUrl(project.url)}" target="_blank" rel="noopener noreferrer">源码</a><button class="favorite ${isFav?"saved":""}" data-project="${safe(project.name)}" onclick="favoriteProject(this)">${isFav?"已藏":"收藏"}</button></div>
    </div>`;projectsBox.appendChild(card);});
}

function findProject(name){return allProjects.find(p=>p.name===name)}
function filterCategory(type){const key=type.toLowerCase(),aliases={ai:["人工智能","ai"],工具:["开发工具","工具"],web:["web"],python:["python"]},words=aliases[key]||[key],data=allProjects.filter(p=>arr(p.analysis?.["所属领域"]).some(f=>words.some(w=>String(f).toLowerCase().includes(w))));renderProjects(data);setCollectionNote(`${type} 方向 · 共 ${data.length} 个项目`);scrollProjects();}
function showAll(){renderProjects(allProjects);setCollectionNote("先看懂，再运行，最后尝试改动一个小功能。");scrollProjects();}
function showFavorites(){const fav=getFavorites(),data=allProjects.filter(p=>fav.includes(p.name));renderProjects(data);setCollectionNote(`我的收藏 · ${data.length} 个待研习项目`);scrollProjects();}
function setCollectionNote(text){document.getElementById("collection-note").textContent=text;}
function scrollProjects(){document.getElementById("collection").scrollIntoView({behavior:"smooth"});}
function toggleMobileMenu(force){const el=document.getElementById("mobile-menu");el.classList.toggle("open",typeof force==="boolean"?force:undefined)}

function favoriteProject(button){const name=button.dataset.project,f=getFavorites(),i=f.indexOf(name);if(i>=0){f.splice(i,1);button.textContent="收藏";button.classList.remove("saved")}else{f.push(name);button.textContent="已藏";button.classList.add("saved")}localStorage.setItem("favorites",JSON.stringify(f));}

function openFirstLab(){if(allProjects[0])openLab(allProjects[0]);else scrollProjects()}
function openLabByButton(button){const p=findProject(button.dataset.name);if(p)openLab(p)}
function openLab(project){activeProject=project;activeLabTab="preview";clearTimeout(labSessionTimer);document.getElementById("lab-title").textContent=project.name;document.querySelectorAll(".lab-tabs button").forEach(b=>b.classList.toggle("active",b.dataset.tab==="preview"));document.getElementById("lab").hidden=false;document.body.classList.add("modal-open");renderLab();labSessionTimer=setTimeout(closeLab,10*60*1000);}
function closeLab(){clearTimeout(labSessionTimer);document.getElementById("lab").hidden=true;document.getElementById("lab-body").replaceChildren();activeProject=null;document.body.classList.remove("modal-open");}
function switchLabTab(button){activeLabTab=button.dataset.tab;document.querySelectorAll(".lab-tabs button").forEach(b=>b.classList.toggle("active",b===button));renderLab();}
function renderLab(){
  const p=activeProject,a=p.analysis||{},guide=a["使用指南"]||{},body=document.getElementById("lab-body");
  if(activeLabTab==="preview"){
    if(p.homepage){body.innerHTML=`<div class="preview-notice"><b>在线演示</b><span>部分网站禁止被嵌入；如果下方空白，请点击“新窗口打开”。</span><a href="${safeUrl(p.homepage)}" target="_blank" rel="noopener noreferrer">新窗口打开</a></div><iframe class="project-frame" src="${safeUrl(p.homepage)}" title="${safe(p.name)} 在线演示" sandbox="allow-forms allow-scripts allow-same-origin allow-popups"></iframe>`;}
    else{body.innerHTML=`<div class="no-preview"><span>习</span><h3>这个项目没有提供可嵌入的在线演示</h3><p>它可能需要 Python、Node.js、桌面环境或 API 密钥。网页不能安全地直接运行任意 GitHub 源码，但可以在“运行指南”中一步步完成本地体验。</p><button onclick="document.querySelector('[data-tab=guide]').click()">查看运行指南</button><a href="${safeUrl(p.url)}" target="_blank" rel="noopener noreferrer">打开源码仓库</a></div>`;}
  }else if(activeLabTab==="guide"){
    const rows=[["第一步 · 准备环境",guide["安装方法"]],["第二步 · 启动项目",guide["运行方法"]],["第三步 · 尝试部署",guide["网页部署"]],["进阶 · 二次开发",guide["二次开发难度"]]];
    body.innerHTML=`<div class="guide-workbench">${rows.map((r,i)=>`<article><input type="checkbox" id="task-${i}"><label for="task-${i}"><small>${r[0]}</small><b>${safe(r[1],"请进入 README 查看作者说明")}</b></label></article>`).join("")}<div class="lab-links"><a href="${safeUrl(p.url)}" target="_blank" rel="noopener noreferrer">打开 README / 源码</a>${p.homepage?`<a href="${safeUrl(p.homepage)}" target="_blank" rel="noopener noreferrer">打开项目官网</a>`:""}</div></div>`;
  }else{
    const key=`study-note:${p.name}`,note=localStorage.getItem(key)||"";body.innerHTML=`<div class="notes-panel"><label>我的研习笔记 <small>自动保存在当前浏览器</small></label><textarea id="study-note" placeholder="例如：这个项目解决了什么问题？我成功运行到哪一步？下一次准备修改什么？">${safe(note,"")}</textarea><div><button onclick="saveStudyNote()">保存笔记</button><span id="note-status"></span></div></div>`;
  }
}
function saveStudyNote(){const value=document.getElementById("study-note").value;localStorage.setItem(`study-note:${activeProject.name}`,value);document.getElementById("note-status").textContent="已保存";}

function openTranslator(){document.getElementById("translator").hidden=false;document.body.classList.add("modal-open");setTimeout(()=>document.getElementById("translate-source").focus(),30)}
function closeTranslator(){clearTranslation();document.getElementById("translator").hidden=true;document.body.classList.remove("modal-open")}
function clearTranslation(){document.getElementById("translate-source").value="";document.getElementById("translate-count").textContent="0 / 6000";document.getElementById("translation-result").innerHTML='<div class="translation-empty">翻译后，这里会同时显示中文内容和开源术语解释。</div>'}
async function runTranslation(){const source=document.getElementById("translate-source").value.trim(),box=document.getElementById("translation-result");if(!source){box.innerHTML='<div class="translation-empty error-text">请先粘贴需要翻译的英文。</div>';return}box.innerHTML='<div class="translation-empty">正在理解并翻译…</div>';try{const result=await window.translateLearningText(source);box.innerHTML=`<article class="translated-copy">${safe(result.translation).replace(/\n/g,"<br>")}</article>${arr(result.glossary).length?`<div class="glossary"><b>本段开源术语</b>${result.glossary.map(x=>`<span><code>${safe(x.term)}</code>${safe(x.meaning)}</span>`).join("")}</div>`:""}`}catch(error){box.innerHTML=`<div class="translation-empty error-text">${safe(error.message)}</div>`}}
document.getElementById("translate-source").addEventListener("input",e=>document.getElementById("translate-count").textContent=`${e.target.value.length} / 6000`);
document.addEventListener("keydown",e=>{if(e.key!=="Escape")return;if(!document.getElementById("translator").hidden)closeTranslator();else if(!document.getElementById("lab").hidden)closeLab()});
loadProjects();
