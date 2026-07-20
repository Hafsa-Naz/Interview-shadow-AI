from fastapi.testclient import TestClient

from app.main import app
from app.services import ai


def test_demo_interview_workflow(monkeypatch):
    monkeypatch.setenv("DEMO_MODE", "true")
    with TestClient(app) as client:
        started = client.post("/api/v1/interviews/start", json={
            "candidate_name": "Demo Candidate", "role": "Backend Engineer", "seniority": "mid", "skills": ["Python"],
        })
        assert started.status_code == 201
        question = started.json()
        assert "Python" in question["question"]

        saved = client.post(f"/api/v1/interviews/{question['interview_id']}/answers", json={
            "question": question["question"], "answer": "I designed a Python API with validation, tests, monitoring, and reliable deployment.", "question_number": 1,
        })
        assert saved.status_code == 201
        assert client.post(f"/api/v1/interviews/{question['interview_id']}/finish").status_code == 200
        scorecard = client.post(f"/api/v1/interviews/{question['interview_id']}/scorecard")
        assert scorecard.status_code == 200
        assert 25 <= scorecard.json()["scorecard"]["overall_score"] <= 90


def test_demo_questions_are_distinct_across_fifteen_rounds(monkeypatch):
    monkeypatch.setenv("DEMO_MODE", "true")
    candidate = {"role": "Backend Engineer", "skills": ["Python"], "resume_context": "Built an API", "project_context": "Order platform"}
    transcript = [{"answer": "I owned the API architecture, chose PostgreSQL over a document database, measured latency and improved reliability through monitoring and testing."}]
    questions = [ai.next_question(candidate, transcript, number)["question"] for number in range(1, 16)]
    assert len(set(questions)) == 15
