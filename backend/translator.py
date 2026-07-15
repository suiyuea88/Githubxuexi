def analyze_project(name, description, language):


    if not description:

        description = "暂无英文介绍"



    # 简单规则分析版
    # 后续接AI大模型


    text = description.lower()



    category = "开发工具"


    if "ai" in text or "agent" in text or "model" in text:

        category = "人工智能"



    elif "web" in text or "frontend" in text:

        category = "Web开发"



    elif "security" in text or "hack" in text:

        category = "网络安全"



    elif language == "Python":

        category = "Python项目"



    return {


中文简介:

f"""
{name} 是一个开源 {category} 项目。


这个项目主要用于帮助开发者学习和研究相关技术。


项目原始介绍：

{description}


简单理解：

它是一个可以实际运行的开源案例，
适合通过阅读源码了解项目架构和开发方式。
"""



        "项目分类":

        category,



        "学习价值":

        "★★★★★",



        "推荐学习":

        [
            language,
            "开源项目阅读",
            "代码实践"
        ]

    }
