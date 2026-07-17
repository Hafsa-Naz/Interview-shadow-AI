-- SQLite schema for local development and inspection.
-- SQLAlchemy creates the same schema automatically when the API starts.
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    display_name TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS interviews (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id),
    candidate_name TEXT NOT NULL,
    role TEXT NOT NULL,
    seniority TEXT NOT NULL,
    skills JSON NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    finished_at DATETIME
);

CREATE TABLE IF NOT EXISTS answers (
    id TEXT PRIMARY KEY,
    interview_id TEXT NOT NULL REFERENCES interviews(id),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    question_number INTEGER NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS scorecards (
    id TEXT PRIMARY KEY,
    interview_id TEXT NOT NULL UNIQUE REFERENCES interviews(id),
    overall_score INTEGER NOT NULL,
    communication INTEGER NOT NULL,
    technical_knowledge INTEGER NOT NULL,
    confidence INTEGER NOT NULL,
    areas_to_improve JSON NOT NULL,
    strengths JSON NOT NULL,
    summary TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS ix_interviews_user_id ON interviews(user_id);
CREATE INDEX IF NOT EXISTS ix_answers_interview_id ON answers(interview_id);
