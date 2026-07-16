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


"中文简介":

f"""
{name} 是一个开源 {category} 项目。


简单来说：

这是一个帮助开发者学习和研究相关技术的开源项目。


项目介绍：

{description}
""",



"项目分类":

category,



"学习价值":

"★★★★★",



"难度等级":

"⭐⭐⭐ 中级",



"为什么热门":

[
"技术方向当前发展迅速",
"拥有较高社区关注度",
"适合学习实际项目开发"
],



"学习路线":

[
"了解项目基础概念",
"阅读项目文档",
"运行官方示例",
"尝试修改源码"
],
"使用指南":
{

"普通用户":
"优先寻找作者提供的软件版、在线版或一键安装方式",


"开发者运行":
"根据项目文档安装环境并运行源码",


"安装方式":
"查看README中的安装说明",


"是否支持EXE":
"Python项目通常可以尝试PyInstaller打包",


"是否支持网页部署":
"根据项目架构判断，可改造成Web应用",


"二次开发难度":
"⭐⭐⭐ 中等"

}


"推荐学习":

[
language,
"开源项目阅读",
"代码实践"
]

}
