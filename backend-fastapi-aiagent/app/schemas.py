from pydantic import BaseModel
from typing import List

class JobDescription(BaseModel):
    title: str
    company: str
    description: str

class SummaryResult(BaseModel):
    summary: str
    recommendScore: int
    tags: List[str]