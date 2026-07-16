const API_URL =
"https://githubxuexi.onrender.com/projects";


const projectsBox =
document.getElementById("projects");


let allProjects = [];




// 安全处理

function safe(v){

    return v || "暂无";

}



function arr(v){

    return Array.isArray(v)
    ? v
    : [];

}







// 获取数据


fetch(API_URL)

.then(res=>res.json())

.then(data=>{


    allProjects=data;


    renderProjects(data);


    updateRecommend(data[0]);


})

.catch(()=>{


projectsBox.innerHTML=

`
<div class="card">

加载失败，请检查接口

</div>
`;

});









// 推荐


function updateRecommend(project){


if(!project){

return;

}


let a =
project.analysis || {};



let title =
document.getElementById("hero-title");

let desc =
document.getElementById("hero-desc");



if(title){

title.innerHTML=

"🔥 "+safe(project.name);

}



if(desc){

desc.innerHTML=

safe(
a["一句话介绍"]
);

}


}









// 项目列表


function renderProjects(data){



projectsBox.innerHTML="";




data.forEach(project=>{


let a =
project.analysis || {};



let fields =
arr(
a["所属领域"]
);




let play =
arr(
a["可以做什么"]
);





let card =
document.createElement("div");



card.className="card";




card.innerHTML=`

<h2>

🔥 ${safe(project.name)}

</h2>



<div class="tags">


<span>

⭐ ${safe(project.stars)}

</span>


<span>

💻 ${safe(project.language)}

</span>



${

fields.slice(0,2)

.map(

x=>`

<span>

${x}

</span>

`

)

.join("")

}



</div>





<h3>

🧠 项目是什么？

</h3>


<p>

${safe(
a["一句话介绍"]
)}

</p>







<h3>

🚀 怎么玩？

</h3>


<p>

${

play.slice(0,2)

.map(

x=>"✅ "+x

)

.join("<br>")

}


</p>







<div class="card-buttons">


<a

href="detail.html?name=${encodeURIComponent(project.name)}"

>

📖 详情

</a>




<a

href="${project.url}"

target="_blank"

>

🚀 源码

</a>




<button

onclick="favoriteProject('${project.name}')"

>

⭐ 收藏

</button>



</div>



`;




projectsBox.appendChild(card);



});



}









// 分类


function filterCategory(type){



let result =


allProjects.filter(project=>{


let fields =

arr(

project.analysis?.["所属领域"]

);



return fields.some(x=>{


return x
.toLowerCase()
.includes(
type.toLowerCase()
);


});



});



renderProjects(result);



}









// 全部


function showAll(){


renderProjects(allProjects);


}









// 滚动


function scrollProjects(){


document

.getElementById("projects")

.scrollIntoView({

behavior:"smooth"

});


}









// 收藏


function favoriteProject(name){



let favorites =

JSON.parse(

localStorage.getItem("favorites")

||"[]"

);




if(
favorites.includes(name)

){


alert(

"已经收藏"

);


return;


}




favorites.push(name);



localStorage.setItem(

"favorites",

JSON.stringify(favorites)

);



alert(

"收藏成功 ⭐"

);


}
