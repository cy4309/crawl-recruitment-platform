# Groq: llama3-70b-8192
# OpenRouter.ai: meta-llama/llama-4-scout-17b-16e-instruct

from app.config import GROQ_API_KEY, GROQ_API_URL
from app.utils import extract_json_from_text
import httpx

async def generate_summaries(jobs: list) -> list:
    prompt = """
You are an AI HR assistant. For each job below, please return:

1. summary: One short English recommendation sentence (max 20 words).
2. recommendScore: An integer between 1 and 10 (higher means more recommended).
3. tags: A list of relevant keywords, like ["React", "Animation", "Design Thinking"].

Return ONLY a JSON array like this:

[
  {
    "summary": "...",
    "recommendScore": 1-10,
    "tags": ["...", "..."]
  },
  ...
]

Job data:
"""
    for idx, job in enumerate(jobs, 1):
        prompt += (
            f"\n[{idx}]\n"
            f"Title: {job['title']}\n"
            f"Company: {job['company']}\n"
            f"Description: {job['description']}\n"
        )
    prompt += "\nOnly output a valid JSON array. Do not include explanations or extra text."

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                GROQ_API_URL,
                headers={
                    "Authorization": f"Bearer {GROQ_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": "llama3-70b-8192",  # Groq LLaMA3
                    "messages": [{"role": "user", "content": prompt}],
                    "temperature": 0.7,
                },
                timeout=60.0,
            )
            response.raise_for_status()
            data = response.json()
            content = data["choices"][0]["message"]["content"].strip()
            parsed = extract_json_from_text(content)
            if isinstance(parsed, list):
                return parsed
            else:
                raise ValueError("Could not parse JSON array from Groq response")
    except Exception as e:
        print("❌ Groq AI processing error:", e)
        print("🔎 Raw content:", locals().get("content", "No content"))
        return [
            {
                "summary": "System error. Please try again.",
                "recommendScore": 0,
                "tags": []
            }
            for _ in jobs
        ]
    
# ---以下中文summaries和tags

# from app.config import GROQ_API_KEY, GROQ_API_URL
# from app.utils import extract_json_from_text
# import httpx

# async def generate_summaries(jobs: list) -> list:
#     prompt = """
# 你是一位人資 AI，請針對以下多個職缺，分別提供以下資訊，並用 JSON 陣列格式回傳：

# 每個職缺請回覆：
# 1. summary：一句推薦語，用繁體中文
# 2. recommendScore：1～10 分，越高代表越推薦（用數字即可）
# 3. tags：技能或特徵關鍵字列表（例如 [\"React\", \"動畫\", \"設計思維\"]）

# 請用下列 JSON 陣列格式回覆（不要有任何說明文字）：

# [
#   {
#     "summary": "...",
#     "recommendScore": 整數1~10,
#     "tags": ["...", "..."]
#   },
#   ...
# ]

# 職缺資料如下：
# """
#     for idx, job in enumerate(jobs, 1):
#         prompt += f"\n[{idx}]\n職稱：{job['title']}\n公司：{job['company']}\n描述：{job['description']}\n"
#     prompt += "\n請只輸出 JSON 陣列，不要有任何說明或格式之外的文字。"
#     try:
#         async with httpx.AsyncClient() as client:
#             response = await client.post(
#                 GROQ_API_URL,
#                 headers={
#                     "Authorization": f"Bearer {GROQ_API_KEY}",
#                     "Content-Type": "application/json",
#                 },
#                 json={
#                     "model": "llama3-70b-8192", # Groq
#                     # "model": "meta-llama/llama-4-scout-17b-16e-instruct", # OpenRouter.ai 免費30次
#                     "messages": [{"role": "user", "content": prompt}],
#                     "temperature": 0.7,
#                 },
#                 timeout=60.0,
#             )
#             response.raise_for_status()
#             data = response.json()
#             content = data["choices"][0]["message"]["content"].strip()
#             parsed = extract_json_from_text(content)
#             if isinstance(parsed, list):
#                 return parsed
#             else:
#                 raise ValueError("無法解析 Groq 回傳 JSON 陣列")
#     except Exception as e:
#         print("❌ AI 分析錯誤：", e)
#         print("🔎 Groq 原始回傳：", locals().get("content", "無內容"))
#         # 回傳與 jobs 數量相同的錯誤訊息
#         return [
#             {
#                 "summary": "系統錯誤，請稍後再試。",
#                 "recommendScore": 0,
#                 "tags": []
#             }
#             for _ in jobs
#         ]