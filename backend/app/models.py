import uuid
from datetime import datetime
from sqlalchemy import DateTime, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base

def new_id() -> str: return str(uuid.uuid4())

class Interview(Base):
    __tablename__ = "interviews"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    candidate_name: Mapped[str] = mapped_column(String(120))
    role: Mapped[str] = mapped_column(String(160))
    seniority: Mapped[str] = mapped_column(String(50))
    skills: Mapped[list] = mapped_column(JSON, default=list)
    status: Mapped[str] = mapped_column(String(20), default="active")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    finished_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    answers: Mapped[list["Answer"]] = relationship(back_populates="interview", cascade="all, delete-orphan")

class Answer(Base):
    __tablename__ = "answers"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    interview_id: Mapped[str] = mapped_column(ForeignKey("interviews.id"), index=True)
    question: Mapped[str] = mapped_column(Text)
    answer: Mapped[str] = mapped_column(Text)
    question_number: Mapped[int] = mapped_column(Integer)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    interview: Mapped[Interview] = relationship(back_populates="answers")
