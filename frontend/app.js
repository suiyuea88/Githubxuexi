const API =
"https://githubxuexi.onrender.com/projects";


fetch(API)

.then(res => res.json())

.then(data => {


    let html = "";


    data.forEach(project => {


        html += `

        <div class="card">


            <h2>
            🔥 ${project.name}
            </h2>


            <p>
            👤 作者：
            ${project.author}
            </p>


            <p class="star">
            ⭐ Star：
            ${project.stars}
            </p>


            <p>
            💻 技术语言：
            ${project.language}
            </p>


            <hr>


            <h3>
            📖 项目简介
            </h3>


            <p>
            <h3>
            📖 中文简介
            </h3>
            
            <p>
            ${project.analysis["中文简介"]}
            </p>
            
            
            <h3>
            🎯 项目分类
            </h3>
            
            <p>
            ${project.analysis["项目分类"]}
            </p>
            
            
            <h3>
            📚 学习价值
            </h3>
            
            <p>
            ${project.analysis["学习价值"]}
            </p>

            <h3>
            🛠️ 如何使用
            </h3>
            
            
            <p>
            👤 普通用户：
            
            ${project.analysis["使用指南"]["普通用户"]}
            
            </p>
            
            
            <p>
            💻 开发运行：
            
            ${project.analysis["使用指南"]["开发者运行"]}
            
            </p>
            
            
            <p>
            📦 安装方式：
            
            ${project.analysis["使用指南"]["安装方式"]}
            
            </p>
            
            
            <p>
            🪟 EXE支持：
            
            ${project.analysis["使用指南"]["是否支持EXE"]}
            
            </p>
            
            
            <p>
            🌐 网页部署：
            
            ${project.analysis["使用指南"]["是否支持网页部署"]}
            
            </p>
            
            
            <p>
            ⭐ 二次开发：
            
            ${project.analysis["使用指南"]["二次开发难度"]}
            
            </p>
            
           <h3>
            🧠 推荐学习
            </h3>
            
            <p>
            
            ${project.analysis["推荐学习"].join("、")}
            
            </p>
            
            
            <h3>
            🔥 为什么热门
            </h3>
            
            <p>
            
            ${project.analysis["为什么热门"].join("、")}
            
            </p>
            
            
            
            <h3>
            📈 难度等级
            </h3>
            
            <p>
            
            ${project.analysis["难度等级"]}
            
            </p>
            
            
            
            <h3>
            📚 学习路线
            </h3>
            
            <p>
            
            ${project.analysis["学习路线"].join(" → ")}
            
            </p>

            </p>


            <a href="${project.url}" target="_blank">
            🔗 查看源码
            </a>


        </div>

        `;


    });



    document.getElementById(
        "projects"
    ).innerHTML = html;



})


.catch(error=>{

console.error(error);

document.getElementById("projects").innerHTML =
"加载失败：" + error.message;

});
