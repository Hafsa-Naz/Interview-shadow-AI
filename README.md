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

Open the URL shown by Vite (normally `http://localhost:5173`). With no Firebase variables, the app uses a local demo sign-in so you can test the complete interview flow immediately. With no OpenAI key, it returns a clearly labelled local demo scorecard. Add the Firebase and OpenAI environment values to use the production integrations.

## Data model

Firebase users own interview history. Each interview has many answers and one saved scorecard. The local default is SQLite; configure `DATABASE_URL` to use a managed database in production.
