const API_URL =
"https://githubxuexi.onrender.com/projects";



const box =
document.getElementById("detail");




function text(v){

return v || "暂无";

}



function arr(v){

return Array.isArray(v)
?v
:[];

}






const params =
new URLSearchParams(
window.location.search
);



const name =
params.get("name");







fetch(API_URL)


.then(res=>res.json())


.then(data=>{


const project =
data.find(
item=>item.name===name
);



if(!project){


box.innerHTML="项目不存在";


return;


}



render(project);



});








function render(project){



const a =
project.analysis || {};




box.innerHTML=`

<div class="detail-card">



<div class="detail-title">


<h1>

🔥 ${text(project.name)}

</h1>


<div class="tags">


<span>

⭐ ${text(project.stars)}

</span>


<span>

💻 ${text(project.language)}

</span>


</div>


</div>






<section>


<h2>

🧠 它是什么？

</h2>


<p>

${text(
a["一句话介绍"]
)}

</p>


</section>








<section>


<h2>

🌍 项目领域

</h2>


<p>

${
arr(
a["所属领域"]
)
.join(" · ")
}

</p>


</section>









<section>


<h2>

🎮 普通用户怎么玩？

</h2>


<p>


${
arr(
a["可以做什么"]
)

.map(
x=>"✅ "+x
)

.join("<br>")

}


</p>


</section>









<section>


<h2>

👨‍💻 开发者怎么玩？

</h2>



<p>

推荐：

<br>

1. 查看源码结构

<br>

2. 本地运行项目

<br>

3. 修改功能

<br>

4. 二次开发


</p>


</section>







<section>


<h2>

📚 学习价值

</h2>


<p>

${text(
a["学习价值"]
)}

</p>


</section>







<div class="detail-buttons">


<a

href="${project.url}"

target="_blank">


🚀 查看源码


</a>



<button>


⭐ 收藏项目


</button>


</div>



</div>

`;



}
