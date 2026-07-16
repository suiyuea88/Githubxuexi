"""Rule-based beginner-friendly diagnostics for common open-source setup errors."""

import re


RULES = [
    (r"modulenotfounderror|no module named", "Python 缺少依赖包", ["确认已进入项目使用的虚拟环境", "执行 pip install -r requirements.txt", "仍缺失时，安装报错中点名的包"], "不要同时混用多个 Python 环境里的 pip。"),
    (r"command not found|is not recognized as an internal|'不是内部或外部命令", "命令未安装或未加入 PATH", ["先确认报错的命令名称", "安装对应运行环境，如 Node.js、Python 或 Git", "关闭终端后重新打开，再检查版本命令"], "不要从陌生网站随意下载同名 exe。"),
    (r"eresolve|unable to resolve dependency tree|peer dependency", "Node.js 依赖版本冲突", ["优先使用项目 README 指定的 Node.js 版本", "删除 node_modules 后按锁定文件选择 npm ci、pnpm install 或 yarn", "查看冲突信息中的两个包版本"], "--force 或 --legacy-peer-deps 只应作为临时排查，不是首选。"),
    (r"eaddrinuse|address already in use|port .* already", "启动端口已被占用", ["查看报错中的端口号", "关闭占用该端口的旧进程，或给新项目换端口", "重新启动并访问新端口"], "不要盲目结束所有系统进程。"),
    (r"permission denied|eacces|operation not permitted", "文件或目录权限不足", ["确认当前账号对项目目录有写入权限", "将项目移到自己的工作目录再试", "检查是否被杀毒软件或正在运行的程序占用"], "不要为了省事给整个磁盘开放完全权限。"),
    (r"cors|blocked by cors policy|access-control-allow-origin", "浏览器跨域请求被拦截", ["确认前端请求的 API 地址是否正确", "在后端配置允许的前端域名", "检查 OPTIONS 预检请求和 HTTPS 混合内容"], "浏览器扩展关闭 CORS 只能临时调试，不是上线解法。"),
    (r"404|not found", "请求路径或文件不存在", ["核对报错中的完整 URL 或文件路径", "确认后端是否真的注册了该路由", "检查部署时的根目录和大小写"], "不要只反复刷新，应先检查实际请求地址。"),
    (r"401|unauthorized|bad credentials|authentication failed", "身份验证或 Token 无效", ["确认 Token 是否过期且具备需要的权限", "将 Token 配置在环境变量，不要写进代码", "重新生成后同步更新部署平台配置"], "不要把 Token、密码或私钥发给他人。"),
]


def diagnose_error(text: str) -> dict:
    cleaned = text.strip()
    if not cleaned:
        raise ValueError("请粘贴完整报错信息")
    if len(cleaned) > 8000:
        raise ValueError("报错信息最多 8000 个字符")
    lower = cleaned.lower()
    for pattern, title, steps, caution in RULES:
        if re.search(pattern, lower):
            return {"matched": True, "title": title, "steps": steps, "caution": caution, "evidence": _evidence(cleaned, pattern)}
    return {"matched": False, "title": "暂未匹配到常见报错", "steps": ["复制从第一行 Error 到最后一行的完整信息", "记录执行的命令、系统和运行环境版本", "在项目 Issues 中搜索最关键的一行错误"], "caution": "提问时请删除 Token、密码、私钥和个人路径。", "evidence": ""}


def _evidence(text: str, pattern: str) -> str:
    for line in text.splitlines():
        if re.search(pattern, line, re.I):
            return line.strip()[:300]
    return ""
