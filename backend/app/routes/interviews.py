from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Answer, Interview
from app.schemas import AnswerRequest, AnswerResponse, FinishResponse, QuestionResponse, ScorecardResponse, StartInterviewRequest
from app.services import ai

router = APIRouter(prefix="/interviews", tags=["Interviews"])


def interview_or_404(interview_id: str, db: Session) -> Interview:
    interview = db.get(Interview, interview_id)
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    return interview


def candidate(interview: Interview) -> dict:
    return {"name": interview.candidate_name, "role": interview.role, "seniority": interview.seniority, "skills": interview.skills}


def transcript(interview: Interview) -> list[dict]:
    return [{"question": item.question, "answer": item.answer, "question_number": item.question_number} for item in sorted(interview.answers, key=lambda item: item.question_number)]


@router.post("/start", response_model=QuestionResponse, status_code=status.HTTP_201_CREATED)
def start_interview(payload: StartInterviewRequest, db: Session = Depends(get_db)):
    interview = Interview(**payload.model_dump())
    db.add(interview); db.commit(); db.refresh(interview)
    try:
        generated = ai.next_question(candidate(interview), [], 1)
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    return QuestionResponse(interview_id=interview.id, question_number=1, **generated)


@router.post("/{interview_id}/answers", response_model=AnswerResponse, status_code=status.HTTP_201_CREATED)
def submit_answer(interview_id: str, payload: AnswerRequest, db: Session = Depends(get_db)):
    interview = interview_or_404(interview_id, db)
    if interview.status != "active":
        raise HTTPException(status_code=409, detail="Interview is no longer active")
    saved = Answer(interview_id=interview_id, **payload.model_dump())
    db.add(saved); db.commit(); db.refresh(saved)
    return AnswerResponse(answer_id=saved.id)


@router.post("/{interview_id}/next-question", response_model=QuestionResponse)
def next_question(interview_id: str, db: Session = Depends(get_db)):
    interview = interview_or_404(interview_id, db)
    if interview.status != "active":
        raise HTTPException(status_code=409, detail="Interview is no longer active")
    number = len(interview.answers) + 1
    try:
        generated = ai.next_question(candidate(interview), transcript(interview), number)
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    return QuestionResponse(interview_id=interview.id, question_number=number, **generated)


@router.post("/{interview_id}/finish", response_model=FinishResponse)
def finish_interview(interview_id: str, db: Session = Depends(get_db)):
    interview = interview_or_404(interview_id, db)
    if interview.status != "finished":
        interview.status = "finished"; interview.finished_at = datetime.utcnow(); db.commit()
    return FinishResponse(interview_id=interview.id, status=interview.status, finished_at=interview.finished_at)


@router.post("/{interview_id}/scorecard", response_model=ScorecardResponse)
def generate_scorecard(interview_id: str, db: Session = Depends(get_db)):
    interview = interview_or_404(interview_id, db)
    if interview.status != "finished":
        raise HTTPException(status_code=409, detail="Finish the interview before generating a scorecard")
    if not interview.answers:
        raise HTTPException(status_code=422, detail="At least one answer is required")
    try:
        scorecard = ai.scorecard(candidate(interview), transcript(interview))
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    return ScorecardResponse(interview_id=interview.id, scorecard=scorecard)
