import Button from "../components/Button";

function Feedback() {
  const feedback = {
    overall: 86,
    communication: 90,
    technical: 82,
    confidence: 84,
    suggestions: [
      "Speak more confidently.",
      "Give more project-based examples.",
      "Use the STAR method for behavioral questions.",
      "Reduce filler words like 'um' and 'actually'.",
    ],
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white py-12 px-6">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-5xl font-bold text-center mb-3">
          Interview Feedback
        </h1>

        <p className="text-center text-gray-400 mb-10">
          Your AI interview has been analyzed successfully.
        </p>

        {/* Overall Score */}
        <div className="bg-slate-900 rounded-3xl p-10 text-center shadow-xl mb-10">

          <h2 className="text-2xl text-gray-300">
            Overall Score
          </h2>

          <h1 className="text-7xl font-bold text-purple-500 mt-4">
            {feedback.overall}%
          </h1>

        </div>

        {/* Score Cards */}

        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <div className="bg-slate-900 rounded-2xl p-8 text-center">
            <h3 className="text-gray-400">Communication</h3>
            <h2 className="text-5xl font-bold text-green-400 mt-3">
              {feedback.communication}%
            </h2>
          </div>

          <div className="bg-slate-900 rounded-2xl p-8 text-center">
            <h3 className="text-gray-400">Technical Knowledge</h3>
            <h2 className="text-5xl font-bold text-blue-400 mt-3">
              {feedback.technical}%
            </h2>
          </div>

          <div className="bg-slate-900 rounded-2xl p-8 text-center">
            <h3 className="text-gray-400">Confidence</h3>
            <h2 className="text-5xl font-bold text-yellow-400 mt-3">
              {feedback.confidence}%
            </h2>
          </div>

        </div>

        {/* Suggestions */}

        <div className="bg-slate-900 rounded-3xl p-8 mb-10">

          <h2 className="text-3xl font-bold mb-6">
            AI Suggestions
          </h2>

          <ul className="space-y-4">

            {feedback.suggestions.map((item, index) => (
              <li
                key={index}
                className="bg-slate-800 rounded-xl p-4"
              >
                ✅ {item}
              </li>
            ))}

          </ul>

        </div>

        {/* Buttons */}

        <div className="flex justify-center gap-6 flex-wrap">

          <Button>
            Download Report
          </Button>

          <Button>
            Retake Interview
          </Button>

        </div>

      </div>

    </div>
  );
}

export default Feedback;