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


        "中文简介":

        f"""
{name} 是一个开源 {category} 项目。


简单理解：

这是一个可以帮助开发者学习和研究相关技术的开源项目。


项目原始介绍：

{description}
""",



        "项目分类":

        category,



        "学习价值":

        "★★★★★",



        "推荐学习":

        [
            language,
            "开源项目阅读",
            "代码实践"
        ],



        "使用指南":

        {


            "普通用户":

            "优先寻找作者提供的软件版、在线版或一键安装方式",



            "开发者运行":

            "根据README文档安装环境并运行源码",



            "安装方式":

            "查看项目官方文档中的安装步骤",



            "是否支持EXE":

            "Python项目通常可以尝试使用PyInstaller打包",



            "是否支持网页部署":

            "根据项目架构判断，可以改造成Web应用",



            "二次开发难度":

            "⭐⭐⭐ 中等"

        }

    }
