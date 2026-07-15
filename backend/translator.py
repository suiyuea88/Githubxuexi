def translate_project(text):

    if not text:
        return {
            "zh":"暂无介绍",
            "analysis":"暂无分析"
        }


    # 第一版先做基础翻译映射
    # 后面接AI接口


    translations = {

        "framework":
        "开发框架",

        "agent":
        "智能体",

        "AI":
        "人工智能",

        "model":
        "模型",

        "tool":
        "工具",

        "library":
        "代码库",

        "open source":
        "开源"

    }


    result=text


    for k,v in translations.items():

        result=result.replace(
            k,
            v
        )


    return {

        "zh":
        result,


        "analysis":

        "这是一个开源项目，主要解决开发效率和技术应用问题，适合作为学习案例。"

    }
