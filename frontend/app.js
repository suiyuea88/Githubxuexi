const API_URL = "https://githubxuexi.onrender.com/projects";


const projectsBox =
document.getElementById("projects");


let allProjects = [];





function safe(value){


    if(value === undefined || value === null || value === ""){

        return "暂无";

    }


    return value;


}





function array(value){


    return Array.isArray(value)
    ? value
    : [];

}






// 获取项目


fetch(API_URL)


.then(res=>res.json())


.then(data=>{


    allProjects = data;


    updateRecommend(data[0]);


    renderProjects(data);


})



.catch(error=>{


    projectsBox.innerHTML=`

    <div class="card">

    数据加载失败

    </div>

    `;


});










// 首页推荐


function updateRecommend(project){



    if(!project){

        return;

    }



    const analysis =
    project.analysis || {};




    const title =
    document.getElementById("hero-title");



    const desc =
    document.getElementById("hero-desc");




    if(title){


        title.innerHTML =
        "🔥 "+safe(project.name);


    }




    if(desc){


        desc.innerHTML =
        safe(
        analysis["一句话介绍"]
        );


    }



}











// 渲染项目


function renderProjects(data){


    projectsBox.innerHTML="";



    if(data.length===0){


        projectsBox.innerHTML=

        `

        <div class="card">

        暂无符合项目

        </div>

        `;


        return;


    }





    data.forEach(project=>{



        const analysis =
        project.analysis || {};



        const fields =
        array(
        analysis["所属领域"]
        );



        const play =
        array(
        analysis["可以做什么"]
        );





        const card=document.createElement("div");


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
        fields
        .slice(0,3)
        .map(
        item=>`

        <span>

        ${item}

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
        analysis["一句话介绍"]
        )}

        </p>








        <h3>

        🚀 怎么玩？

        </h3>


        <p>


        ${
        play.length

        ?

        play
        .slice(0,3)
        .map(
        x=>"✅ "+x
        )
        .join("<br>")

        :

        "查看源码体验"

        }


        </p>







        <div class="card-buttons">


        <a

        href="${project.url}"

        target="_blank">

        🚀 查看源码

        </a>



        <button

        onclick="favoriteProject('${project.name}')">

        ⭐ 收藏

        </button>



        </div>



        `;



        projectsBox.appendChild(card);



    });


}









// 分类筛选


function filterCategory(category){



    const result =
    allProjects.filter(project=>{


        const analysis =
        project.analysis || {};



        const fields =
        array(
        analysis["所属领域"]
        );



        return fields.some(item=>{


            return item
            .toLowerCase()
            .includes(
            category.toLowerCase()
            );


        });



    });




    renderProjects(result);



}









// 显示全部


function showAll(){


    renderProjects(allProjects);


}










// 滚动到项目


function scrollProjects(){


    document
    .getElementById("projects")
    .scrollIntoView({

        behavior:"smooth"

    });


}








// 收藏预留


function favoriteProject(name){



    let favorites =
    JSON.parse(
    localStorage.getItem("favorites")
    || "[]"
    );



    if(!favorites.includes(name)){


        favorites.push(name);


        localStorage.setItem(

        "favorites",

        JSON.stringify(favorites)

        );


        alert(
        "收藏成功 ⭐"
        );


    }else{


        alert(
        "已经收藏过了"
        );


    }


}
