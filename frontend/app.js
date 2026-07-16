const API_URL = "https://githubxuexi.onrender.com/projects";


const projectsBox = document.getElementById("projects");



function safe(value){

    if(value === undefined || value === null || value === ""){

        return "暂无介绍";

    }

    return value;

}




function getArray(value){

    if(Array.isArray(value)){

        return value;

    }

    return [];

}






fetch(API_URL)


.then(response=>response.json())


.then(data=>{


    if(!data || data.length===0){

        projectsBox.innerHTML="暂无项目";

        return;

    }



    showToday(data);


    renderCards(data);


})


.catch(error=>{


    projectsBox.innerHTML=`

    <div class="card">

    加载失败，请检查接口

    </div>

    `;


});








// 首页推荐区域


function showToday(data){



    const item=data[0];



    const title=document.getElementById("hero-title");


    const desc=document.getElementById("hero-desc");



    if(title){


        title.innerHTML=
        "🔥 "+safe(item.name);


    }



    if(desc){


        let text="";



        if(item.analysis){


            text=
            item.analysis["一句话介绍"]
            ||
            item.description
            ||
            "热门开源项目";


        }


        desc.innerHTML=safe(text);


    }





}











// 项目卡片


function renderCards(data){



    projectsBox.innerHTML="";



    data.forEach(item=>{



        const analysis=item.analysis || {};



        const card=document.createElement("div");


        card.className="card";



        let fields=getArray(
            analysis["所属领域"]
        );



        let play=getArray(
            analysis["可以怎么玩"]
        );




        card.innerHTML=`

        <h2>

        🔥 ${safe(item.name)}

        </h2>





        <div class="tags">


        <span>

        ⭐ ${safe(item.stars)}

        </span>


        <span>

        💻 ${safe(item.language)}

        </span>


        </div>







        <h3>

        📌 项目是什么？

        </h3>



        <p>


        ${
            safe(
            analysis["一句话介绍"]
            ||
            item.description
            )

        }


        </p>







        <h3>

        🌍 领域

        </h3>



        <p>


        ${
            fields.length

            ?

            fields.join(" · ")

            :

            "开源项目"

        }


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

            "查看源码学习项目结构"

        }


        </p>






        <a

        class="github-btn"

        href="${item.url}"

        target="_blank">


        查看源码 🚀


        </a>


        `;




        projectsBox.appendChild(card);



    });



}
