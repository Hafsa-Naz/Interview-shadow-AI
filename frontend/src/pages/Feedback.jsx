import { useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button";

function Feedback() {
  const { state: feedback } = useLocation(); const navigate = useNavigate();
  if (!feedback) { navigate("/interview", { replace: true }); return null; }
  const scores = [["Communication", feedback.communication, "text-green-400"], ["Technical Knowledge", feedback.technical_knowledge, "text-blue-400"], ["Confidence", feedback.confidence, "text-yellow-400"]];
  const detailedFeedback = feedback.detailed_feedback?.length ? feedback.detailed_feedback : scores.map(([category, score]) => ({
    category, assessment: `${score}% score in ${category.toLowerCase()}.`, evidence: "This scorecard was generated without a detailed transcript evaluation.", next_step: "Retake the interview to receive answer-specific feedback."
  }));
  return <div className="min-h-screen bg-slate-950 text-white py-12 px-6"><div className="max-w-5xl mx-auto">
    <h1 className="text-5xl font-bold text-center mb-3">Interview Feedback</h1><p className="text-center text-gray-400 mb-4">{feedback.summary}</p><p className="text-center font-bold text-purple-300 mb-10">Hiring recommendation: {feedback.hiring_recommendation}</p>
    <div className="bg-slate-900 rounded-3xl p-10 text-center shadow-xl mb-10"><h2 className="text-2xl text-gray-300">Overall Score</h2><h1 className="text-7xl font-bold text-purple-500 mt-4">{feedback.overall_score}%</h1></div>
    <div className="grid md:grid-cols-3 gap-6 mb-10">{scores.map(([label, score, colour]) => <div key={label} className="bg-slate-900 rounded-2xl p-8 text-center"><h3 className="text-gray-400">{label}</h3><h2 className={`text-5xl font-bold mt-3 ${colour}`}>{score}%</h2></div>)}</div>
    <div className="grid md:grid-cols-2 gap-6 mb-10"><section className="bg-slate-900 rounded-3xl p-8"><h2 className="text-2xl font-bold mb-4">Strengths</h2><ul className="space-y-3">{feedback.strengths.map((item) => <li key={item} className="bg-slate-800 rounded-xl p-4">✓ {item}</li>)}</ul></section><section className="bg-slate-900 rounded-3xl p-8"><h2 className="text-2xl font-bold mb-4">Areas to Improve</h2><ul className="space-y-3">{feedback.areas_to_improve.map((item) => <li key={item} className="bg-slate-800 rounded-xl p-4">• {item}</li>)}</ul></section></div>
    <section className="bg-slate-900 rounded-3xl p-8 mb-10"><h2 className="text-2xl font-bold mb-2">Detailed Evaluation</h2><p className="text-gray-400 mb-6">Why each score was given and the fastest way to improve it.</p><div className="grid md:grid-cols-3 gap-5">{detailedFeedback.map((item) => <article key={item.category} className="bg-slate-800 rounded-2xl p-5"><h3 className="font-bold text-lg text-purple-300 mb-3">{item.category}</h3><p className="mb-4"><span className="text-gray-400">Assessment:</span> {item.assessment}</p><p className="mb-4"><span className="text-gray-400">Evidence:</span> {item.evidence}</p><p><span className="text-gray-400">Next step:</span> {item.next_step}</p></article>)}</div></section>
    <div className="flex justify-center"><Button onClick={() => navigate("/interview")}>Retake Interview</Button></div>
  </div></div>;
}
export default Feedback;
