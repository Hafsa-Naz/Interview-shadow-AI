# Interview Shadow AI

An adaptive technical-interview practice app with React, FastAPI, Firebase Authentication, SQLite, GPT-5 support, a 15-question interview flow, and detailed scorecard feedback.

## Repository layout

| Folder | Purpose |
| --- | --- |
| `frontend/` | React and Tailwind client, interview workflow, and scorecard UI |
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

## Run the complete app locally

Open two terminals:

```powershell
# Terminal 1
cd backend
python -m uvicorn app.main:app --reload

# Terminal 2
cd frontend
Copy-Item .env.example .env
npm ci
npm run dev
```

Open the URL shown by Vite (normally `http://localhost:5173`). With no Firebase variables, the app uses a local demo sign-in. To generate genuinely adaptive interview questions from each answer, add `OPENAI_API_KEY` to `backend/.env` and restart the backend. Template questions are available only when `DEMO_MODE=true` is explicitly set; they are not the default interview experience.

## Data model

Firebase users own interview history. Each interview has many answers and one saved scorecard. The local default is SQLite; configure `DATABASE_URL` to use a managed database in production.
