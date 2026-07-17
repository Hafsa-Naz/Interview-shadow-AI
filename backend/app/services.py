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
        if not self.client and os.getenv("DEMO_MODE", "true").lower() == "true":
            skills = candidate.get("skills") or [candidate.get("role", "your role")]
            if question_number == 1:
                question = f"Tell me about a project where you used {skills[0]}. What problem did you solve and what was your contribution?"
                focus = "project experience"
            elif transcript and len(transcript[-1].get("answer", "").split()) < 25:
                question = f"Could you give a more specific example, including the technical decisions you made using {skills[0]}?"
                focus = "depth and clarity"
            else:
                question = f"For a {candidate.get('role', 'technical')} role, how would you approach improving reliability or performance in a system using {skills[0]}?"
                focus = "technical problem solving"
            return {"question": question, "focus_area": focus}
        payload = {"candidate": candidate, "previous_q_and_a": transcript, "next_question_number": question_number}
        return self._json_response(QUESTION_SYSTEM_PROMPT, json.dumps(payload))

    def scorecard(self, candidate: dict, transcript: list[dict]) -> Scorecard:
        if not self.client and os.getenv("DEMO_MODE", "true").lower() == "true":
            lengths = [len(item["answer"].split()) for item in transcript]
            average_length = sum(lengths) / len(lengths)
            technical = min(90, max(55, int(60 + average_length)))
            communication = min(90, max(55, int(58 + average_length)))
            confidence = min(90, max(55, int(55 + average_length)))
            overall = round((technical + communication + confidence) / 3)
            return Scorecard(
                overall_score=overall, communication=communication, technical_knowledge=technical, confidence=confidence,
                strengths=["Completed every interview response", "Provided relevant technical detail"],
                areas_to_improve=["Use concrete metrics to describe impact", "Structure behavioural answers with the STAR method"],
                summary="Demo scorecard generated locally. Add an OpenAI API key for GPT-5 feedback tailored to the complete transcript.",
            )
        return Scorecard.model_validate(self._json_response(SCORECARD_SYSTEM_PROMPT, json.dumps({"candidate": candidate, "interview_transcript": transcript})))


ai = InterviewAI()
