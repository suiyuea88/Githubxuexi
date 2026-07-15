
fetch(
"http://127.0.0.1:8000/projects"
)

.then(
res=>res.json()
)

.then(
data=>{


let html="";


data.forEach(item=>{


html+=`

<div class="card">


<h2>
${item.name}
</h2>


<p>
作者：
${item.author}
</p>



<p class="star">

⭐ ${item.stars}

</p>



<p>
语言：
${item.language}
</p>



<p>

中文简介：

${item.description}

</p>



<a href="${item.url}" target="_blank">

查看项目

</a>



</div>


`


})


document.getElementById(
"list"
).innerHTML=html;



})
