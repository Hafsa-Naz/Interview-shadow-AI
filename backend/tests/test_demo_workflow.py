from fastapi.testclient import TestClient

from app.main import app


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
        assert scorecard.json()["scorecard"]["overall_score"] >= 55
