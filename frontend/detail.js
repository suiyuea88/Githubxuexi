const API_URL =
"https://githubxuexi.onrender.com/projects";



const box =
document.getElementById("detail");





function text(v){

if(!v){

return "暂无";

}

return v;

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


box.innerHTML=

"没有找到这个项目";


return;


}




show(project);



});








function show(project){



const a =
project.analysis || {};



box.innerHTML=`

<div class="detail-card">



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






<h2>

🧠 这是一个什么项目？

</h2>


<p>

${text(
a["一句话介绍"]
)}

</p>







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








<h2>

🚀 普通用户怎么玩？

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








<h2>

📚 学习价值

</h2>



<p>

${text(
a["学习价值"]
)}

</p>








<a

class="source-btn"

href="${project.url}"

target="_blank">


🚀 查看源码


</a>



</div>

`;



}
