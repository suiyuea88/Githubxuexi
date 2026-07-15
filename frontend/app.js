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
            🧠 推荐学习
            </h3>
            
            <p>
            
            ${project.analysis["推荐学习"].join("、")}
            
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


    document.getElementById(
        "projects"
    ).innerHTML =
    "加载失败，请检查接口";


});
