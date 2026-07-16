const API_URL = "https://githubxuexi.onrender.com/projects";


const projectsBox =
document.getElementById("projects");



function text(v){

    if(v === undefined || v === null || v === ""){

        return "暂无";

    }

    return v;

}



function list(v){

    return Array.isArray(v) ? v : [];

}






fetch(API_URL)


.then(res=>res.json())


.then(data=>{


    updateRecommend(data);


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


function updateRecommend(projects){



    if(!projects || projects.length===0){

        return;

    }



    const project=projects[0];


    const analysis =
    project.analysis || {};




    const title =
    document.getElementById("hero-title");



    const desc =
    document.getElementById("hero-desc");




    if(title){

        title.innerHTML=
        "🔥 "+text(project.name);

    }



    if(desc){

        desc.innerHTML=
        text(
        analysis["一句话介绍"]
        );

    }



    const info=document.querySelectorAll(".info-box div");



    if(info.length>=3){


        info[0].innerHTML=
        `
        领域
        <br>
        <span>
        ${
        list(
        analysis["所属领域"]
        ).join(" / ")
        }
        </span>
        `;



        info[1].innerHTML=
        `
        热度
        <br>
        <span>
        ⭐ ${text(project.stars)}
        </span>
        `;




        info[2].innerHTML=
        `
        难度
        <br>
        <span>
        新手友好
        </span>
        `;


    }



}








// 项目列表


function renderProjects(projects){



    projectsBox.innerHTML="";



    projects.forEach(project=>{


        const a =
        project.analysis || {};



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

        🧠 这是一个什么项目？

        </h3>



        <p>

        ${text(a["一句话介绍"])}

        </p>






        <h3>

        🌍 项目领域

        </h3>



        <p>

        ${
        list(
        a["所属领域"]
        ).join(" · ")
        }

        </p>






        <h3>

        🚀 可以怎么玩？

        </h3>



        <p>


        ${
        list(
        a["可以做什么"]
        )

        .map(x=>"✅ "+x)

        .join("<br>")

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
