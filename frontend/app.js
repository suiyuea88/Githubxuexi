const API_URL = "https://githubxuexi.onrender.com/projects";


const projectsBox = document.getElementById("projects");

let allProjects = [];


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


    allProjects = projects;



    renderProjects(projects); 
    })



        const analysis = project.analysis || {};

        const guide = analysis["使用指南"] || {};




        const card = document.createElement("div");


        card.className = "card";



card.innerHTML = `

<div class="project-header">


<h2>
🔥 ${safeText(project.name)}
</h2>


<div class="tags">


<span class="tag">
⭐ ${safeText(project.stars)}
</span>


<span class="tag">
💻 ${safeText(project.language)}
</span>



</div>


</div>




<div class="section">


<h3>
🧠 一句话认识
</h3>


<p>

${safeText(
analysis["一句话介绍"]
)}

</p>


</div>





<div class="section">


<h3>
🌍 技术领域
</h3>


<div class="tags">


${

Array.isArray(analysis["所属领域"])

?

analysis["所属领域"]
.map(item=>`

<span class="tag blue">

${item}

</span>

`).join("")

:

"<span>暂无</span>"

}


</div>


</div>






<div class="section">


<h3>
🚀 可以做什么
</h3>


<ul>


${
Array.isArray(analysis["可以做什么"])

?

analysis["可以做什么"]
.map(item=>`

<li>
${item}
</li>

`).join("")

:

"<li>暂无</li>"

}


</ul>


</div>







<div class="score-box">


<div>

🔥 兴趣指数

<br>

<strong>

${safeText(
analysis["兴趣指数"]
)}

</strong>

</div>



<div>

📚 学习价值

<br>

<strong>

${safeText(
analysis["学习价值"]
)}

</strong>

</div>



</div>







<div class="section">


<h3>
🎮 新手怎么玩
</h3>


<p>

${safeText(
guide["普通用户"]
)}

</p>


</div>







<div class="section">


<h3>
👨‍🎓 适合人群
</h3>


<p>

${safeArray(
analysis["适合人群"]
)}

</p>


</div>







<a class="github-btn"

href="${project.url}"

target="_blank">

查看源码 🚀

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
function renderProjects(projects){


projectsBox.innerHTML="";



projects.forEach(project=>{


// 这里保留你现在的 card 创建代码


});


}




function filterProjects(category){



if(category==="all"){


renderProjects(allProjects);


return;


}



const result =
allProjects.filter(project=>{


const fields =
project.analysis["所属领域"] || [];


return fields.includes(category);


});



renderProjects(result);



}
