# openai

from openai import AsyncOpenAI
from app.config import OPENAI_API_KEY
from app.utils import extract_json_from_text

client = AsyncOpenAI(api_key=OPENAI_API_KEY)

async def generate_summaries(jobs: list) -> list:
    prompt = """
You are an HR AI assistant. For each job listing below, generate:

1. summary: A short English recommendation sentence (max 20 words)
2. recommendScore: An integer from 1 to 10 (higher means better fit)
3. tags: A list of keywords (e.g., ["React", "Animation", "Design Thinking"])

Please return ONLY a **pure JSON array**, like this:

[
  {
    "summary": "Great for Python backend developers.",
    "recommendScore": 8,
    "tags": ["Python", "Backend", "API"]
  },
  ...
]

Jobs:
"""

    for idx, job in enumerate(jobs, 1):
        prompt += (
            f"\n[{idx}]\n"
            f"Title: {job['title']}\n"
            f"Company: {job['company']}\n"
            f"Description: {job['description']}\n"
        )

    prompt += "\nPlease output only a valid JSON array. No explanation or extra text."

    try:
        response = await client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
        )
        content = response.choices[0].message.content.strip()
        parsed = extract_json_from_text(content)
        if isinstance(parsed, list):
            return parsed
        else:
            print("⚠️ JSON parse failed. AI returned:")
            print(content)
            raise ValueError("Failed to parse JSON from GPT response")
    except Exception as e:
        print("❌ GPT error:", e)
        print("🔎 Raw content:", locals().get("content", "No content"))
        print("🔎 Input jobs:", jobs)
        return [
            {
                "summary": "System error. Please try again.",
                "recommendScore": 0,
                "tags": []
            }
            for _ in jobs
        ]

# ---以下中文summaries和tags

# from openai import AsyncOpenAI
# from app.config import OPENAI_API_KEY
# from app.utils import extract_json_from_text

# client = AsyncOpenAI(api_key=OPENAI_API_KEY)

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
#         response = await client.chat.completions.create(
#             model="gpt-4o",
#             messages=[{"role": "user", "content": prompt}],
#             temperature=0.7,
#         )
#         content = response.choices[0].message.content.strip()
#         parsed = extract_json_from_text(content)
#         if isinstance(parsed, list):
#             return parsed
#         else:
#             print("⚠️ 解析失敗，AI 回傳內容如下：")
#             print(content)
#             print("--- jobs 輸入內容如下 ---")
#             print(jobs)
#             raise ValueError("無法解析 GPT 回傳 JSON 陣列")
#     except Exception as e:
#         print("❌ AI 分析錯誤：", e)
#         print("🔎 GPT 原始回傳：", locals().get("content", "無內容"))
#         print("🔎 jobs 輸入內容：", jobs)
#         # 回傳與 jobs 數量相同的錯誤訊息
#         return [
#             {
#                 "summary": "系統錯誤，請稍後再試。",
#                 "recommendScore": 0,
#                 "tags": []
#             }
#             for _ in jobs
#         ]