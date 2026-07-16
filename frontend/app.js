const API_URL = "https://githubxuexi.onrender.com/projects";


const projectsBox = document.getElementById("projects");





function safe(value){


    if(value === undefined || value === null || value === ""){


        return "暂无";


    }


    return value;


}





function arr(value){


    if(Array.isArray(value)){


        return value;


    }


    return [];


}








fetch(API_URL)


.then(res=>res.json())


.then(data=>{


    if(!data || data.length===0){


        projectsBox.innerHTML="暂无项目";


        return;


    }



    updateRecommend(data[0]);



    renderProjects(data);



})



.catch(err=>{


    projectsBox.innerHTML=`

    <div class="card">

    加载失败

    </div>

    `;


});









// 更新首页推荐


function updateRecommend(project){



    const analysis =
    project.analysis || {};



    const title =
    document.getElementById("hero-title");



    const desc =
    document.getElementById("hero-desc");



    if(title){


        title.innerHTML=
        "🔥 "+safe(project.name);


    }




    if(desc){


        desc.innerHTML=
        safe(
        analysis["一句话介绍"]
        );


    }



}









// 项目卡片


function renderProjects(data){



    projectsBox.innerHTML="";



    data.forEach(project=>{



        const analysis =
        project.analysis || {};



        const card=document.createElement("div");


        card.className="card";



        const fields =
        arr(
        analysis["所属领域"]
        );



        const things =
        arr(
        analysis["可以做什么"]
        );



        const people =
        arr(
        analysis["适合人群"]
        );






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

<span>${x}</span>

`
)
.join("")
}


</div>







<h3>

🧠 它是什么？

</h3>



<p>

${safe(
analysis["一句话介绍"]
)}

</p>







<h3>

🚀 可以怎么玩？

</h3>



<p>


${
things.length

?

things.slice(0,3)
.map(
x=>"✅ "+x
)
.join("<br>")

:

"查看源码体验"

}



</p>








<h3>

👨‍🎓 适合

</h3>


<p>


${
people.length

?

people.slice(0,2)
.join("、")

:

"开发学习者"

}


</p>







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
