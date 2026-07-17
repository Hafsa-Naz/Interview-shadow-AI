from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from app.database import Base
from app.models import Answer, Interview, Scorecard, User


def test_interview_history_persists_with_scorecard(tmp_path: Path):
    engine = create_engine(f"sqlite:///{tmp_path / 'test.db'}")
    Base.metadata.create_all(engine)
    with Session(engine) as db:
        user = User(id="firebase-user-1", email="candidate@example.com", display_name="Candidate")
        interview = Interview(user_id=user.id, candidate_name="Candidate", role="Backend Engineer", seniority="mid", skills=["Python"])
        db.add_all([user, interview])
        db.flush()
        db.add(Answer(interview_id=interview.id, question="What is FastAPI?", answer="A Python API framework.", question_number=1))
        db.add(Scorecard(interview_id=interview.id, overall_score=80, communication=78, technical_knowledge=85, confidence=76, areas_to_improve=["Add concrete examples"], strengths=["Clear explanation"], summary="Strong foundation."))
        db.commit()
        stored = db.get(Interview, interview.id)
        assert stored.user_id == user.id
        assert len(stored.answers) == 1
        assert stored.scorecard.overall_score == 80
