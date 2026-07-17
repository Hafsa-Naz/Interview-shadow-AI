import { useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button";

function Feedback() {
  const { state: feedback } = useLocation(); const navigate = useNavigate();
  if (!feedback) { navigate("/interview", { replace: true }); return null; }
  const scores = [["Communication", feedback.communication, "text-green-400"], ["Technical Knowledge", feedback.technical_knowledge, "text-blue-400"], ["Confidence", feedback.confidence, "text-yellow-400"]];
  return <div className="min-h-screen bg-slate-950 text-white py-12 px-6"><div className="max-w-5xl mx-auto">
    <h1 className="text-5xl font-bold text-center mb-3">Interview Feedback</h1><p className="text-center text-gray-400 mb-10">{feedback.summary}</p>
    <div className="bg-slate-900 rounded-3xl p-10 text-center shadow-xl mb-10"><h2 className="text-2xl text-gray-300">Overall Score</h2><h1 className="text-7xl font-bold text-purple-500 mt-4">{feedback.overall_score}%</h1></div>
    <div className="grid md:grid-cols-3 gap-6 mb-10">{scores.map(([label, score, colour]) => <div key={label} className="bg-slate-900 rounded-2xl p-8 text-center"><h3 className="text-gray-400">{label}</h3><h2 className={`text-5xl font-bold mt-3 ${colour}`}>{score}%</h2></div>)}</div>
    <div className="grid md:grid-cols-2 gap-6 mb-10"><section className="bg-slate-900 rounded-3xl p-8"><h2 className="text-2xl font-bold mb-4">Strengths</h2><ul className="space-y-3">{feedback.strengths.map((item) => <li key={item} className="bg-slate-800 rounded-xl p-4">✓ {item}</li>)}</ul></section><section className="bg-slate-900 rounded-3xl p-8"><h2 className="text-2xl font-bold mb-4">Areas to Improve</h2><ul className="space-y-3">{feedback.areas_to_improve.map((item) => <li key={item} className="bg-slate-800 rounded-xl p-4">• {item}</li>)}</ul></section></div>
    <div className="flex justify-center"><Button onClick={() => navigate("/interview")}>Retake Interview</Button></div>
  </div></div>;
}
export default Feedback;
