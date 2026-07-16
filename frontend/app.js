const API_URL = "https://githubxuexi.onrender.com/projects";


const projectsBox = document.getElementById("projects");



// 安全读取
function safeText(value, defaultText="暂无") {

    if(value === undefined || value === null || value === ""){

        return defaultText;

    }

    return value;

}


// 安全数组
function safeArray(value){

    if(Array.isArray(value)){

        return value.join(" 、 ");

    }

    return "暂无";

}



// 加载项目

fetch(API_URL)


.then(response => {


    if(!response.ok){

        throw new Error("接口访问失败");

    }


    return response.json();


})


.then(projects => {


    projectsBox.innerHTML = "";



    projects.forEach(project => {



        const analysis = project.analysis || {};

        const guide = analysis["使用指南"] || {};




        const card = document.createElement("div");


        card.className = "card";



        card.innerHTML = `


<h2>
🔥 ${safeText(project.name)}
</h2>



<p>
⭐ Star：
${safeText(project.stars)}
</p>


<p>
💻 技术：
${safeText(project.language)}
</p>




<hr>



<h3>
🧠 一句话认识它
</h3>


<p>

${safeText(
analysis["一句话介绍"]
)}

</p>





<h3>
🌍 所属领域
</h3>


<p>

${safeArray(
analysis["所属领域"]
)}

</p>





<h3>
🚀 它能做什么？
</h3>


<p>

${safeArray(
analysis["可以做什么"]
)}

</p>





<h3>
🔥 为什么值得玩？
</h3>


<p>

${safeText(
analysis["为什么值得玩"]
)}

</p>





<h3>
🎮 新手怎么玩？
</h3>


<p>

${safeText(
guide["普通用户"]
)}

</p>





<h3>
👨‍🎓 适合谁学习？
</h3>


<p>

${safeArray(
analysis["适合人群"]
)}

</p>





<h3>
⭐ 兴趣指数
</h3>


<p>

${safeText(
analysis["兴趣指数"]
)}

</p>





<h3>
📚 学习价值
</h3>


<p>

${safeText(
analysis["学习价值"]
)}

</p>





<h3>
🛠 开发信息
</h3>


<p>

💻 开发运行：

${safeText(
guide["开发者"]
)}

</p>


<p>

📦 EXE：

${safeText(
guide["EXE"]
)}

</p>


<p>

🌐 网页部署：

${safeText(
guide["网页"]
)}

</p>





<a href="${project.url}" target="_blank">

查看 GitHub 源码

</a>


        `;



        projectsBox.appendChild(card);



    });



})



.catch(error => {


    console.error(error);


    projectsBox.innerHTML = `

    <h3>
    加载失败
    </h3>


    <p>
    ${error.message}
    </p>


    `;


});
