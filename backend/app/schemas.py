from datetime import datetime
from pydantic import BaseModel, Field

class StartInterviewRequest(BaseModel):
    candidate_name: str = Field(min_length=1, max_length=120)
    role: str = Field(min_length=1, max_length=160)
    seniority: str = Field(default="mid", pattern="^(junior|mid|senior)$")
    skills: list[str] = Field(default_factory=list, max_length=20)
    resume_context: str = Field(default="", max_length=6000)
    project_context: str = Field(default="", max_length=4000)
class QuestionResponse(BaseModel):
    interview_id: str; question_number: int; question: str; focus_area: str
class AnswerRequest(BaseModel):
    question: str = Field(min_length=1); answer: str = Field(min_length=1); question_number: int = Field(ge=1)
class AnswerResponse(BaseModel): answer_id: str; saved: bool = True
class FinishResponse(BaseModel): interview_id: str; status: str; finished_at: datetime
class FeedbackDetail(BaseModel):
    category: str
    assessment: str
    evidence: str
    next_step: str
class Scorecard(BaseModel):
    overall_score: int = Field(ge=0, le=100); communication: int = Field(ge=0, le=100); technical_knowledge: int = Field(ge=0, le=100); confidence: int = Field(ge=0, le=100)
    areas_to_improve: list[str]; strengths: list[str]; summary: str
    hiring_recommendation: str = "Insufficient evidence"
    detailed_feedback: list[FeedbackDetail] = Field(default_factory=list)
class ScorecardResponse(BaseModel): interview_id: str; scorecard: Scorecard
