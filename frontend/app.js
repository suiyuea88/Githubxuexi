const API_URL = "https://githubxuexi.onrender.com/projects";


const projectsBox = document.getElementById("projects");



function text(value){

    if(value === undefined || value === null || value === ""){

        return "暂无介绍";

    }

    return value;

}



function array(value){

    if(Array.isArray(value)){

        return value;

    }

    return [];

}





fetch(API_URL)


.then(response=>{


    if(!response.ok){

        throw new Error("接口连接失败");

    }


    return response.json();


})


.then(projects=>{


    render(projects);


})



.catch(error=>{


    projectsBox.innerHTML = `


    <div class="card">


    加载失败：

    ${error.message}


    </div>


    `;


});







function render(projects){


    projectsBox.innerHTML="";



    projects.forEach(project=>{


        const a = project.analysis || {};

        const guide = a["使用指南"] || {};



        const card=document.createElement("div");


        card.className="card";



        card.innerHTML=`




<h2>

🔥 ${text(project.name)}

</h2>





<div class="tags">


<span>

⭐ ${text(project.stars)}

</span>


<span>

💻 ${text(project.language)}

</span>


</div>







<h3>

🧠 这个项目是什么？

</h3>



<p>

${text(a["一句话介绍"])}

</p>








<h3>

🌍 它属于什么领域？

</h3>



<div class="tags">


${

array(a["所属领域"])

.map(item=>`

<span>

${item}

</span>

`)

.join("")

}



</div>







<h3>

🚀 它可以做什么？

</h3>



<p>


${

array(a["可以做什么"])

.map(item=>`

<br>

✅ ${item}

`)

.join("")

}


</p>







<div class="score-box">



<div>


🔥 兴趣指数


<br>


${text(a["兴趣指数"])}


</div>




<div>


📚 学习价值


<br>


${text(a["学习价值"])}


</div>



</div>







<h3>

🎮 新手体验方式

</h3>



<p>

${text(guide["普通用户"])}

</p>







<h3>

👨‍🎓 适合哪些人？

</h3>



<p>


${

array(a["适合人群"])

.join(" 、 ")

}


</p>






<a class="github-btn"

href="${project.url}"

target="_blank">


查看源码 🚀


</a>




`;



        projectsBox.appendChild(card);



    });



}
