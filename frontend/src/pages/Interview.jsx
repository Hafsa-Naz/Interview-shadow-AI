import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

function Interview() {
  const navigate = useNavigate();

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");

  const handleStart = () => {
    if (!company || !role || !experience) {
      alert("Please fill in all fields.");
      return;
    }

    // Later we'll send these values to the backend
    console.log({
      company,
      role,
      experience,
    });

    navigate("/session");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">

      <div className="bg-slate-900 p-10 rounded-3xl shadow-xl w-full max-w-xl">

        <h1 className="text-4xl font-bold text-white text-center">
          Interview Setup
        </h1>

        <p className="text-gray-400 text-center mt-3 mb-8">
          Tell us about your target job before starting your AI interview.
        </p>

        <div className="space-y-6">

          <div>
            <label className="text-gray-300 block mb-2">
              Company Name
            </label>

            <input
              type="text"
              placeholder="Google"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full bg-slate-800 border border-gray-700 rounded-xl p-4 text-white focus:border-purple-500 outline-none"
            />
          </div>

          <div>
            <label className="text-gray-300 block mb-2">
              Job Role
            </label>

            <input
              type="text"
              placeholder="AI Engineer"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-slate-800 border border-gray-700 rounded-xl p-4 text-white focus:border-purple-500 outline-none"
            />
          </div>

          <div>
            <label className="text-gray-300 block mb-2">
              Experience Level
            </label>

            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full bg-slate-800 border border-gray-700 rounded-xl p-4 text-white focus:border-purple-500 outline-none"
            >
              <option value="">Select Experience</option>
              <option>Fresh Graduate</option>
              <option>0-1 Years</option>
              <option>1-3 Years</option>
              <option>3-5 Years</option>
              <option>5+ Years</option>
            </select>
          </div>

          <Button
            className="w-full mt-4"
            onClick={handleStart}
          >
            Start AI Interview
          </Button>

        </div>

      </div>

    </div>
  );
}

export default Interview;