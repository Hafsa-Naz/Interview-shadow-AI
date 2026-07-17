import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Button from "../components/Button";
import { startInterview } from "../services/api";

function Interview() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [role, setRole] = useState("");
  const [seniority, setSeniority] = useState("mid");
  const [skills, setSkills] = useState("");
  const [resumeContext, setResumeContext] = useState(() => localStorage.getItem("resume-context") || "");
  const [projectContext, setProjectContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleStart = async () => {
    if (!role || !skills) return setError("Enter the role and at least one skill.");
    setLoading(true); setError("");
    try {
      const firstQuestion = await startInterview({
        candidate_name: user?.email?.split("@")[0] || "Candidate", role, seniority,
        skills: skills.split(",").map((item) => item.trim()).filter(Boolean), resume_context: resumeContext, project_context: projectContext,
      });
      navigate("/session", { state: { ...firstQuestion, role } });
    } catch (err) {
      setError(err.response?.data?.detail || "Could not start the interview. Make sure the backend is running.");
    } finally { setLoading(false); }
  };

  return <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
    <div className="bg-slate-900 p-10 rounded-3xl shadow-xl w-full max-w-xl">
      <h1 className="text-4xl font-bold text-white text-center">Interview Setup</h1>
      <p className="text-gray-400 text-center mt-3 mb-8">Tell us about your target job before starting your AI interview.</p>
      {error && <p className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded-xl mb-5">{error}</p>}
      <div className="space-y-6">
        <label className="text-gray-300 block">Job Role<input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Backend Engineer" className="mt-2 w-full bg-slate-800 border border-gray-700 rounded-xl p-4 text-white outline-none focus:border-purple-500" /></label>
        <label className="text-gray-300 block">Experience Level<select value={seniority} onChange={(e) => setSeniority(e.target.value)} className="mt-2 w-full bg-slate-800 border border-gray-700 rounded-xl p-4 text-white outline-none focus:border-purple-500"><option value="junior">Junior</option><option value="mid">Mid-level</option><option value="senior">Senior</option></select></label>
        <label className="text-gray-300 block">Skills<input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="Python, FastAPI, SQL" className="mt-2 w-full bg-slate-800 border border-gray-700 rounded-xl p-4 text-white outline-none focus:border-purple-500" /></label>
        <label className="text-gray-300 block">Resume highlights<textarea value={resumeContext} onChange={(e) => setResumeContext(e.target.value)} placeholder="Paste your experience, achievements, technologies, and measurable results." rows="4" className="mt-2 w-full bg-slate-800 border border-gray-700 rounded-xl p-4 text-white outline-none focus:border-purple-500 resize-y" /></label>
        <label className="text-gray-300 block">Project to challenge you on<textarea value={projectContext} onChange={(e) => setProjectContext(e.target.value)} placeholder="Project name, the problem, architecture, your contribution, trade-offs, and outcome." rows="4" className="mt-2 w-full bg-slate-800 border border-gray-700 rounded-xl p-4 text-white outline-none focus:border-purple-500 resize-y" /></label>
        <Button className="w-full mt-4" onClick={handleStart}>{loading ? "Preparing interview..." : "Start AI Interview"}</Button>
      </div>
    </div>
  </div>;
}
export default Interview;
