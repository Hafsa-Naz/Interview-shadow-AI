import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { finishInterview, generateScorecard, nextQuestion, submitAnswer } from "../services/api";

function InterviewSession() {
  const totalQuestions = 15;
  const { state } = useLocation(); const navigate = useNavigate();
  const [question, setQuestion] = useState(state); const [answer, setAnswer] = useState("");
  const [count, setCount] = useState(state?.question_number || 1); const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  if (!question) { navigate("/interview", { replace: true }); return null; }
  const handleNext = async () => {
    if (!answer.trim()) return setError("Please answer the question before continuing.");
    setLoading(true); setError("");
    try {
      await submitAnswer(question.interview_id, { question: question.question, answer, question_number: question.question_number });
      if (count >= totalQuestions) {
        await finishInterview(question.interview_id);
        const result = await generateScorecard(question.interview_id);
        navigate("/feedback", { state: result.scorecard, replace: true });
      } else {
        const next = await nextQuestion(question.interview_id);
        setQuestion(next); setCount(next.question_number); setAnswer("");
      }
    } catch (err) { setError(err.response?.data?.detail || "Could not save your answer. Please try again."); }
    finally { setLoading(false); }
  };
  return <div className="min-h-screen bg-slate-950 text-white flex justify-center items-center px-6"><div className="bg-slate-900 w-full max-w-4xl rounded-3xl p-10 shadow-xl">
    <div className="flex justify-between mb-6"><div><h1 className="text-3xl font-bold">AI Mock Interview</h1><p className="text-gray-400">Question {count} of {totalQuestions} · {question.focus_area}</p></div><p className="text-purple-400 font-semibold">Interview Shadow AI</p></div>
    <div className="w-full bg-gray-700 rounded-full h-3 mb-10"><div className="bg-purple-600 h-3 rounded-full" style={{ width: `${(count / totalQuestions) * 100}%` }} /></div>
    <div className="bg-slate-800 rounded-2xl p-8 mb-8"><p className="text-sm text-purple-400 mb-3">AI Interviewer</p><h2 className="text-2xl font-semibold">{question.question}</h2></div>
    {error && <p className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded-xl mb-4">{error}</p>}
    <textarea rows="8" placeholder="Type your answer here..." value={answer} onChange={(e) => setAnswer(e.target.value)} className="w-full bg-slate-800 rounded-2xl border border-gray-700 p-5 outline-none focus:border-purple-500 resize-none" />
    <div className="flex justify-end mt-8"><Button onClick={handleNext}>{loading ? "Saving..." : count === totalQuestions ? "Finish Interview" : "Next Question"}</Button></div>
  </div></div>;
}
export default InterviewSession;
