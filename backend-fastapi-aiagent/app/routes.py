from fastapi import APIRouter
from typing import List
from app.schemas import JobDescription, SummaryResult
from app.services import generate_summaries

ai_router = APIRouter()

@ai_router.post("/summary", response_model=List[SummaryResult])
async def summarize_job(jobs: List[JobDescription]):
    results = await generate_summaries([job.dict() for job in jobs])
    return results