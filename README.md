# Interview Shadow AI

An adaptive technical-interview practice app. The FastAPI backend uses GPT-5 to create follow-up questions and structured scorecards, while Firebase Authentication identifies each candidate.

## Repository layout

| Folder | Purpose |
| --- | --- |
| `frontend/` | React and Tailwind client (to be added from the frontend branch) |
| `backend/` | FastAPI API, GPT-5 prompts, and persistence models |
| `database/` | SQLite reference schema |
| `docs/` | Firebase setup and testing report |

## Quick start

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
uvicorn app.main:app --reload
```

Open `http://localhost:8000/docs` for interactive API documentation. Add an OpenAI API key to enable GPT-5 questions and scorecards. See [Firebase setup](docs/FIREBASE_SETUP.md) before enabling authentication.

## Data model

Firebase users own interview history. Each interview has many answers and one saved scorecard. The local default is SQLite; configure `DATABASE_URL` to use a managed database in production.
