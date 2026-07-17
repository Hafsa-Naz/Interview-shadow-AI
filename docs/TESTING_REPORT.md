# Testing report

Date: 2026-07-17

## Scope

| Area | Verification | Result |
| --- | --- | --- |
| Database | Create users, interviews, answers, and scorecards in a temporary SQLite database | Automated test |
| API startup | FastAPI imports and creates all SQLAlchemy tables | Automated test |
| Authentication | Firebase security switch requires a Bearer token when enabled | Manual configuration check |
| Interview workflow | Start → answer → next question → finish → scorecard | Requires `OPENAI_API_KEY`; documented for integration testing |

## Run tests

```powershell
cd backend
python -m pytest tests -q
```

The test suite uses an isolated SQLite file and never changes `interviews.db`. The GPT-5 workflow needs a real API key and is intentionally not called by automated tests.

## Manual end-to-end checklist

1. Start backend with Firebase enabled and sign in through the frontend.
2. Confirm every request includes the Firebase Bearer token.
3. Start an interview and submit at least one answer.
4. Finish it, generate a scorecard, then inspect `users`, `interviews`, `answers`, and `scorecards` in SQLite.
5. Repeat with a second Firebase account and confirm the first account's interview URL returns 404.
