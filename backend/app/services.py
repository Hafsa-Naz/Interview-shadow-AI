import json
import os

from openai import OpenAI

from app.prompts import QUESTION_SYSTEM_PROMPT, SCORECARD_SYSTEM_PROMPT
from app.schemas import Scorecard

MODEL = os.getenv("OPENAI_MODEL", "gpt-5")


class InterviewAI:
    def __init__(self):
        key = os.getenv("OPENAI_API_KEY")
        self.client = OpenAI(api_key=key) if key else None

    def _json_response(self, instructions: str, prompt: str) -> dict:
        if not self.client:
            raise RuntimeError("OPENAI_API_KEY is not configured")
        response = self.client.responses.create(
            model=MODEL,
            instructions=instructions,
            input=prompt,
            text={"format": {"type": "json_object"}},
        )
        return json.loads(response.output_text)

    def next_question(self, candidate: dict, transcript: list[dict], question_number: int) -> dict:
        payload = {"candidate": candidate, "previous_q_and_a": transcript, "next_question_number": question_number}
        return self._json_response(QUESTION_SYSTEM_PROMPT, json.dumps(payload))

    def scorecard(self, candidate: dict, transcript: list[dict]) -> Scorecard:
        return Scorecard.model_validate(self._json_response(SCORECARD_SYSTEM_PROMPT, json.dumps({"candidate": candidate, "interview_transcript": transcript})))


ai = InterviewAI()
