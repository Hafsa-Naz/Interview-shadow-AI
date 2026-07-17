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
            last_answer = transcript[-1].get("answer", "") if transcript else ""
            answer_reference = " ".join(last_answer.split()[:12])
            if question_number == 1:
                reference = project or resume or f"your experience with {skills[0]}"
                question = f"Give me a concise overview of {reference}. What was the problem, what was your individual role, and how did you measure success?"
                focus = "resume evidence and individual ownership"
            elif question_number == 2 and len(last_answer.split()) < 25:
                question = f'You said "{answer_reference}". That is not enough evidence. Name your specific action, the alternative you rejected, and the measurable result.'
                focus = "evidence, trade-offs, and impact"
            elif question_number == 2:
                question = "What did you personally own in that work? Separate your decisions from the team’s decisions and quantify the outcome."
                focus = "individual ownership"
            elif question_number == 3:
                question = f"Walk me through the architecture of that project. Where did {skills[0]} create the biggest constraint?"
                focus = "project architecture"
            elif question_number == 4:
                question = "What important trade-off did you make? Explain the options, why you rejected one, and what it cost."
                focus = "technical trade-offs"
            elif question_number == 5:
                question = "Tell me about a decision in that project that did not work. How did you discover it, correct it, and prevent a repeat?"
                focus = "failure and learning"
            elif question_number == 6:
                question = f"Explain one {skills[0]} concept you relied on in your work. Do not give a definition—explain how it changed a design decision."
                focus = "technical foundations"
            elif question_number == 7:
                question = f"Design a scalable version of this project for ten times the traffic. Start with requirements, then describe the components and bottlenecks."
                focus = "system design"
            elif question_number == 8:
                question = "Your service latency has doubled after a release. What is your investigation order, and what metric would prove the fix?"
                focus = "reliability and performance"
            elif question_number == 9:
                question = "Describe the hardest bug you debugged. What hypothesis did you test first, what evidence changed your mind, and what was the root cause?"
                focus = "debugging discipline"
            elif question_number == 10:
                question = f"You are owning a {candidate.get('role', 'technical')} system and its key metric drops 20%. What data do you inspect first, what do you change, and how do you know the fix worked?"
                focus = "product and user judgment"
            elif question_number == 11:
                question = "Give an example of working with people outside your function. How did you make the decision understandable and get alignment?"
                focus = "cross-functional collaboration"
            elif question_number == 12:
                question = "Describe a time you disagreed with a teammate on a high-stakes decision. What evidence did you bring, how did you resolve it, and what was the outcome?"
                focus = "constructive disagreement"
            elif question_number == 13:
                question = "You have three urgent requests and capacity for one. How do you prioritise, communicate the decision, and handle the disappointed stakeholders?"
                focus = "ambiguity and prioritisation"
            elif question_number == 14:
                question = "What is a difficult skill you had to learn recently? Show how you identified the gap and turned it into better work."
                focus = "learning and growth"
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
