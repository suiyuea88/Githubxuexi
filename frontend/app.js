const API_URL = "https://githubxuexi.onrender.com/projects";


const projectsBox = document.getElementById("projects");


let allProjects = [];



// 安全文字

function safeText(value){

    if(value === undefined || value === null || value === ""){

        return "暂无";

    }

    return value;

}



// 安全数组

function safeArray(value){

    if(Array.isArray(value)){

        return value;

    }

    return [];

}




// 加载项目


fetch(API_URL)


.then(res => {


    if(!res.ok){

        throw new Error("接口错误");

    }


    return res.json();


})


.then(data=>{


    allProjects = data;


    renderProjects(allProjects);


})


.catch(err=>{


    console.error(err);


    projectsBox.innerHTML = `

    <div class="error">

    加载失败：${err.message}

    </div>

    `;


});






// 渲染项目


function renderProjects(projects){


    projectsBox.innerHTML = "";



    if(projects.length===0){


        projectsBox.innerHTML =
        "<p>暂无项目</p>";


        return;


    }




    projects.forEach(project=>{


        const analysis = project.analysis || {};

        const guide = analysis["使用指南"] || {};



        const card=document.createElement("div");


        card.className="card";



        card.innerHTML=`



        <div class="project-title">


        <h2>
        🔥 ${safeText(project.name)}
        </h2>


        <div class="tags">


        <span>
        ⭐ ${safeText(project.stars)}
        </span>


        <span>
        💻 ${safeText(project.language)}
        </span>


        </div>


        </div>





        <h3>
        🧠 一句话认识
        </h3>


        <p>

        ${safeText(
        analysis["一句话介绍"]
        )}

        </p>






        <h3>
        🌍 所属领域
        </h3>


        <div class="tags">


        ${
            safeArray(
            analysis["所属领域"]
            )
            .map(
            item=>`
            <span class="tag">
            ${item}
            </span>
            `
            )
            .join("")
        }


        </div>






        <h3>
        🚀 它能做什么
        </h3>


        <ul>


        ${
            safeArray(
            analysis["可以做什么"]
            )
            .map(
            item=>`
            <li>${item}</li>
            `
            )
            .join("")
        }


        </ul>







        <div class="score-box">


        <div>

        🔥 兴趣指数

        <br>

        ${safeText(
        analysis["兴趣指数"]
        )}

        </div>



        <div>

        📚 学习价值

        <br>

        ${safeText(
        analysis["学习价值"]
        )}

        </div>


        </div>







        <h3>
        🎮 新手怎么玩
        </h3>


        <p>

        ${safeText(
        guide["普通用户"]
        )}

        </p>






        <h3>
        👨‍🎓 适合谁
        </h3>


        <p>


        ${
        safeArray(
        analysis["适合人群"]
        )
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








// 分类筛选


function filterProjects(category){



    if(category==="all"){


        renderProjects(allProjects);


        return;


    }




    const result =
    allProjects.filter(project=>{


        const fields =
        project.analysis?.["所属领域"] || [];



        return fields.includes(category);



    });



    renderProjects(result);



}
