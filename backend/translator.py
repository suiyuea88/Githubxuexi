def analyze_project(name, description, language):


    if not description:

        description = "暂无英文介绍"



    text = description.lower()



    category = "开发工具"



    if "ai" in text or "agent" in text or "model" in text:

        category = "人工智能"


    elif "web" in text or "frontend" in text:

        category = "Web开发"


    elif language == "Python":

        category = "Python项目"



    return {


    "一句话介绍":

    f"""
{name}

这是一个开源 {category} 项目。

简单来说：

它是一个可以让开发者直接体验和学习相关技术的工具。
""",



    "所属领域":

    [
        category,
        language,
        "开源技术"
    ],



    "可以做什么":

    [
        "体验项目核心功能",
        "学习项目实现方式",
        "了解真实开发案例"
    ],



    "为什么值得玩":

    """
这个项目受到开发者关注，
适合作为学习和实践案例。

通过运行项目，
可以快速了解相关技术。
""",



    "适合人群":

    [
        "想体验新技术的人",
        "开发学习者",
        "程序员"
    ],



    "兴趣指数":

    "⭐⭐⭐⭐☆",



    "学习价值":

    "⭐⭐⭐⭐⭐",



    "难度等级":

    "⭐⭐⭐ 中等",



    "使用指南":

    {


        "普通用户":

        "查看作者是否提供在线体验、软件版本或一键安装方式",



        "开发者":

        "根据README安装环境后运行源码",



        "EXE":

        "Python项目通常可以尝试PyInstaller打包",



        "网页":

        "根据项目结构判断是否适合Web部署"

    }

}
