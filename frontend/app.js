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



<h3>
🧠 一句话认识它
</h3>

<p>

${project.analysis["一句话介绍"]}

</p>



<h3>
🌍 所属领域
</h3>


<p>

${project.analysis["所属领域"] ? project.analysis["所属领域"].join(" 、 ") : "暂无"}

</p>




<h3>
🚀 它能做什么？
</h3>


<p>

${project.analysis["可以做什么"] ? project.analysis["可以做什么"].join("

✅ ") : "暂无"}

</p>




<h3>
🎮 新手怎么玩？
</h3>


<p>

${project.analysis["使用指南"] ? project.analysis["使用指南"]["普通用户"] : "暂无"}

</p>




<h3>
👨‍🎓 适合谁学习？
</h3>


<p>

${project.analysis["适合人群"] ? project.analysis["适合人群"].join(" 、 ") : "暂无"}

</p>




<h3>
🔥 兴趣指数

</h3>


<p>

${project.analysis["兴趣指数"]}

</p>




<h3>
📚 学习价值

</h3>


<p>

${project.analysis["学习价值"]}

</p>



<a href="${project.url}" target="_blank">

查看源码

</a>



</div>

`;



    document.getElementById(
        "projects"
    ).innerHTML = html;



})


.catch(error=>{

console.error(error);

document.getElementById("projects").innerHTML =
"加载失败：" + error.message;

});
