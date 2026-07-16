"""Small, stateless English-to-Chinese helper for README and error messages."""

import re
from html import unescape
from requests import get


TERMS = {
    "repository": "代码仓库", "dependency": "依赖包", "dependencies": "依赖包",
    "clone": "克隆（下载仓库）", "build": "构建", "deploy": "部署", "release": "发布版",
    "issue": "问题单", "pull request": "代码合并请求", "branch": "分支", "commit": "提交记录",
    "environment variable": "环境变量", "runtime": "运行环境", "framework": "开发框架",
}


def _chunks(text: str, limit: int = 480) -> list[str]:
    paragraphs = [part.strip() for part in re.split(r"\n+", text) if part.strip()]
    result: list[str] = []
    for paragraph in paragraphs:
        while len(paragraph) > limit:
            cut = max(paragraph.rfind(". ", 0, limit), paragraph.rfind("; ", 0, limit), paragraph.rfind(" ", 0, limit))
            if cut < 80:
                cut = limit
            result.append(paragraph[:cut].strip())
            paragraph = paragraph[cut:].strip()
        if paragraph:
            result.append(paragraph)
    return result


def translate_to_chinese(text: str) -> dict:
    cleaned = text.strip()
    if not cleaned:
        raise ValueError("请输入需要翻译的英文")
    if len(cleaned) > 6000:
        raise ValueError("单次最多翻译 6000 个字符，请分段处理")

    protected: list[str] = []
    def keep_code(match: re.Match) -> str:
        protected.append(match.group(0))
        return f"ZXCODE{len(protected) - 1}XZ"

    translatable = re.sub(r"```[\s\S]*?```|`[^`\n]+`", keep_code, cleaned)
    translated: list[str] = []
    for chunk in _chunks(translatable):
        response = get(
            "https://api.mymemory.translated.net/get",
            params={"q": chunk, "langpair": "en|zh-CN"},
            timeout=12,
            headers={"User-Agent": "GitHubLearningAcademy/1.0"},
        )
        response.raise_for_status()
        payload = response.json()
        value = (payload.get("responseData") or {}).get("translatedText")
        if not value:
            raise ValueError("翻译服务未返回结果")
        translated.append(unescape(value))

    final_text = "\n\n".join(translated)
    for index, code in enumerate(protected):
        final_text = re.sub(rf"ZX\s*CODE\s*{index}\s*XZ", lambda _: code, final_text, flags=re.I)

    lower = cleaned.lower()
    glossary = [{"term": term, "meaning": meaning} for term, meaning in TERMS.items() if term in lower]
    return {"translation": final_text, "glossary": glossary, "characters": len(cleaned)}
