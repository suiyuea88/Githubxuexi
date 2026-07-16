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







fetch(API_URL)


.then(res=>res.json())


.then(data=>{


    allProjects=data;


    updateRecommend(data[0]);


    renderProjects(data);



})



.catch(error=>{


    projectsBox.innerHTML=

    `

    <div class="card">

    数据加载失败

    </div>

    `;


});









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









function renderProjects(data){



    projectsBox.innerHTML="";



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



        const card =
        document.createElement("div");


        card.className="card";



        card.innerHTML=`

        

        <h2 class="project-name">


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

        📖 查看详情

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

        ⭐收藏

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


        const fields =

        array(

        project.analysis?.["所属领域"]

        );



        return fields.some(item=>

        item.includes(category)

        );



    });



    renderProjects(result);



}






function showAll(){


    renderProjects(allProjects);


}









function scrollProjects(){


document

.getElementById("projects")

.scrollIntoView({

behavior:"smooth"

});


}








function favoriteProject(name){



let list =

JSON.parse(

localStorage.getItem("favorites")

|| "[]"

);




if(!list.includes(name)){


list.push(name);



localStorage.setItem(

"favorites",

JSON.stringify(list)

);



alert("收藏成功 ⭐");



}else{


alert("已经收藏");

}


}
