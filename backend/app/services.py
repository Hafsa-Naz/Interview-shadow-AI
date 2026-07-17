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
            resume = candidate.get("resume_context") or ""
            project = candidate.get("project_context") or ""
            if question_number == 1:
                reference = project or resume or f"your experience with {skills[0]}"
                question = f"Give me a concise overview of {reference}. What was the problem, what was your individual role, and how did you measure success?"
                focus = "resume evidence and individual ownership"
            elif transcript and len(transcript[-1].get("answer", "").split()) < 35:
                question = "Your answer is too high-level. Name one decision you personally made, the alternative you rejected, and the measurable result."
                focus = "evidence, trade-offs, and impact"
            elif question_number == 2:
                question = f"On the project you described, walk me through the architecture. Where did {skills[0]} create the biggest constraint, and what trade-off did you make?"
                focus = "project technical depth"
            elif question_number == 3:
                question = f"You are owning a {candidate.get('role', 'technical')} system and its key metric drops 20%. What data do you inspect first, what do you change, and how do you know the fix worked?"
                focus = "role-specific problem solving"
            elif question_number == 4:
                question = "Describe a time you disagreed with a teammate on a high-stakes decision. What evidence did you bring, how did you resolve it, and what was the outcome?"
                focus = "collaboration under ambiguity"
            else:
                question = "What is the strongest concern a hiring committee should have after this interview, and what evidence from your work would address it?"
                focus = "self-awareness and ownership"
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
                areas_to_improve=["Use concrete metrics to describe impact", "State your individual contribution and rejected alternatives"],
                summary="Demo scorecard generated locally. The recommendation is conservative because this mode cannot deeply evaluate the full transcript. Add an OpenAI API key for GPT-5 feedback tailored to the complete transcript.",
                hiring_recommendation="Insufficient evidence",
            )
        return Scorecard.model_validate(self._json_response(SCORECARD_SYSTEM_PROMPT, json.dumps({"candidate": candidate, "interview_transcript": transcript})))


ai = InterviewAI()
