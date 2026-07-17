from contextlib import asynccontextmanager
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import inspect, text

from app.database import Base, engine
from app.routes.interviews import router as interviews_router


@asynccontextmanager
async def lifespan(_: FastAPI):
    # `create_all` does not add columns to an existing SQLite database. Keep the
    # original hackathon database usable after the authentication update.
    if engine.url.get_backend_name() == "sqlite" and "interviews" in inspect(engine).get_table_names():
        columns = {column["name"] for column in inspect(engine).get_columns("interviews")}
        if "user_id" not in columns:
            with engine.begin() as connection:
                connection.execute(text("ALTER TABLE interviews ADD COLUMN user_id VARCHAR(128)"))
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(title="Interview Shadow AI API", version="1.0.0", description="Adaptive AI interview workflows and structured scorecards.", lifespan=lifespan)
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(interviews_router, prefix="/api/v1")


@app.get("/health", tags=["Health"])
def health_check() -> dict[str, str]:
    return {"status": "ok"}
