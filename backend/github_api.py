import requests
from datetime import datetime, timedelta

from backend.translator import analyze_project



def get_hot_projects():


    today = datetime.now()

    before = today - timedelta(days=30)


    url = "https://api.github.com/search/repositories"


    params = {

        "q":
        f"created:>{before.date()}",

        "sort":
        "stars",

        "order":
        "desc",

        "per_page":
        20
    }



    res = requests.get(
        url,
        params=params
    )


    repos = res.json()["items"]



    result = []



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


            "analysis":

            analyze_project(

                repo["name"],

                repo["description"],

                repo["language"]

            )

        })



    return result
