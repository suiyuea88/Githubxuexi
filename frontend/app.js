const API =
"https://https://githubxuexi.onrender.com/projects";



fetch(API)

.then(res=>res.json())

.then(data=>{


let html="";


data.forEach(project=>{


html+=`

<div class="card">


<h2>
🔥 ${project.name}
</h2>


<p>
👤 作者：
${project.author}
</p>


<p class="star">

⭐ Star:
${project.stars}

</p>



<p>

💻 语言：

${project.language}

</p>


<hr>


<h3>
中文简介
</h3>


<p>

${project.translation}

</p>



<a href="${project.url}" target="_blank">

查看源码

</a>



</div>


`;



});



document.getElementById(
"projects"
).innerHTML=html;



})

.catch(err=>{

document.getElementById(
"projects"
).innerHTML=
"加载失败";

});
