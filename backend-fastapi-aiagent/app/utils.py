import re
import json

def extract_json_from_text(text: str) -> dict:
    """
    從 GPT/Groq 回傳的文字中擷取第一段 JSON 區塊並解析成 dict 或 list。
    若失敗則回傳 None。
    """
    # 去除 markdown 的 ```json ... ``` 或 ``` ... ``` 及前置 'json' 標記
    text = text.strip()
    if text.startswith('```json'):
        text = text[7:]
    if text.startswith('```'):
        text = text[3:]
    text = text.strip('`\n ').lstrip('json').strip()
    try:
        # 先找陣列，再找物件（用貪婪模式）
        match = re.search(r'(\[.*\]|\{.*\})', text, re.DOTALL)
        if match:
            json_str = match.group(0)
            # 修正全形空格
            json_str = json_str.replace('\u3000', ' ')
            # print("json_str repr:", repr(json_str))  # debug 用
            return json.loads(json_str)
        else:
            print("⚠️ 找不到 JSON 區塊")
    except Exception as e:
        print("❌ JSON 擷取錯誤：", e)

    print("🔎 原始回傳內容：", text)
    return None