from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import ai_router
from app.config import ALLOWED_ORIGINS

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    # allow_origin_regex=r"http://localhost:\d+$",  # ✅ 本地浮動 port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ai_router, prefix="/api")
# 將來可以新增爬蟲 API：app.include_router(crawl_router, prefix="/api")