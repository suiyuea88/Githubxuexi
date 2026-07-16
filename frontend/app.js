const API_URL = "https://githubxuexi.onrender.com/projects";


const projectsBox = document.getElementById("projects");


let projectsData = [];





function getText(value){

    if(value === undefined || value === null || value === ""){

        return "暂无介绍";

    }

    return value;

}




function getArray(value){

    return Array.isArray(value) ? value : [];

}





fetch(API_URL)

.then(res=>res.json())


.then(data=>{


    projectsData=data;


    updateHero(data[0]);


    renderProjects(data);


})


.catch(err=>{


    projectsBox.innerHTML=`

    <div class="card">

    加载失败，请检查接口

    </div>

    `;


});








// 更新顶部推荐


function updateHero(project){


    if(!project){

        return;

    }



    const analysis = project.analysis || {};



    const title =
    document.getElementById("hero-title");


    const desc =
    document.getElementById("hero-desc");




    if(title){

        title.innerHTML =
        "🔥 " + getText(project.name);

    }



    if(desc){

        desc.innerHTML =
        getText(
        analysis["一句话介绍"]
        );

    }



}







// 项目列表


function renderProjects(projects){



    projectsBox.innerHTML="";



    projects.forEach(project=>{


        const analysis =
        project.analysis || {};



        const card=document.createElement("div");


        card.className="card";



        card.innerHTML=`





<h2>

🔥 ${getText(project.name)}

</h2>



<div class="tags">


<span>

⭐ ${getText(project.stars)}

</span>


<span>

💻 ${getText(project.language)}

</span>



</div>






<h3>

📖 项目是什么

</h3>



<p>

${getText(
analysis["一句话介绍"]
)}

</p>






<h3>

🌍 项目领域

</h3>



<p>

${
getArray(
analysis["所属领域"]
)
.join("  ·  ")
}

</p>






<h3>

🚀 可以怎么玩

</h3>


<p>


${
getArray(
analysis["可以做什么"]
)

.map(
item=>"✅ "+item
)

.join("<br>")

}



</p>







<div class="info-box">



<div>

🔥 热度

<br>

${getText(project.stars)}

</div>



<div>

📚 学习价值

<br>

${getText(
analysis["学习价值"]
)}

</div>




</div>







<a

class="github-btn"

href="${project.url}"

target="_blank">


查看源码 🚀


</a>






`;



        projectsBox.appendChild(card);



    });



}
