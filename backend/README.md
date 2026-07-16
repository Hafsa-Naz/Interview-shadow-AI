# Interview Shadow AI backend

FastAPI backend for adaptive technical interviews using GPT-5.

## Run locally

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r render-requirements.txt
Copy-Item .env.example .env
uvicorn app.main:app --reload
```

Set `OPENAI_API_KEY` in `.env`. Interactive documentation is at `http://localhost:8000/docs`.

## API endpoints

| Action | Endpoint |
| --- | --- |
| Start Interview | `POST /api/v1/interviews/start` |
| Submit Answer | `POST /api/v1/interviews/{interview_id}/answers` |
| Next Question | `POST /api/v1/interviews/{interview_id}/next-question` |
| Finish Interview | `POST /api/v1/interviews/{interview_id}/finish` |
| Generate Scorecard | `POST /api/v1/interviews/{interview_id}/scorecard` |

Start request: `{"candidate_name":"Aisha Khan","role":"Backend Engineer","seniority":"mid","skills":["Python","FastAPI","SQL"]}`.

Answer request: `{"question":"Explain dependency injection in FastAPI.","answer":"It supplies dependencies...","question_number":1}`.

Scorecards include overall score, communication, technical knowledge, confidence, strengths, areas to improve, and a summary.

## Prompt templates

Versioned prompts are in `app/prompts.py`. GPT-5 is required to return JSON, and scorecards are validated by Pydantic before they are returned.

## Render

Create a Render Blueprint from the GitHub repository. Render reads `backend/render.yaml`; add `OPENAI_API_KEY` as a secret. Use a Render PostgreSQL `DATABASE_URL` in production because Render's filesystem is ephemeral.
