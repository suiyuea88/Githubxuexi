import requests
from datetime import datetime,timedelta
from backend.translator import translate_project


def get_hot_projects():


    today = datetime.now()

    before = today - timedelta(days=30)



    url = "https://api.github.com/search/repositories"


    params={

        "q":
        f"created:>{before.date()}",


        "sort":
        "stars",


        "order":
        "desc",


        "per_page":
        20

    }



    res=requests.get(
        url,
        params=params
    )



    repos=res.json()["items"]



    result=[]



    for repo in repos:


        result.append({

            "name":
            repo["name"],


            "author":
            repo["owner"]["login"],


            "stars":
            repo["stargazers_count"],


            "language":
            repo["language"],


            "url":
            repo["html_url"],


            "translation":

            translate(
                repo["description"]
            )

        })



    return result





def translate(text):


    if not text:

        return "暂无介绍"


    # 第一版简单处理
    # 后面接AI翻译

    return text
