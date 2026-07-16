import { useState } from "react";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
function InterviewSession() {
  const questions = [
    "Tell me about yourself.",
    "Why do you want to join this company?",
    "Explain one AI project you've worked on.",
    "What are your strengths?",
    "Do you have any questions for us?"
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState([]);
  const navigate = useNavigate();
  const handleNext = () => {
    if (answer.trim() === "") {
      alert("Please answer the question.");
      return;
    }

    const updatedAnswers = [...answers, answer];
    setAnswers(updatedAnswers);
    setAnswer("");

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      console.log(updatedAnswers);
      navigate("/feedback");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex justify-center items-center px-6">

      <div className="bg-slate-900 w-full max-w-4xl rounded-3xl p-10 shadow-xl">

        <div className="flex justify-between mb-6">

          <div>
            <h1 className="text-3xl font-bold">
              AI Mock Interview
            </h1>

            <p className="text-gray-400">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>

          <div className="text-right">
            <p className="text-purple-400 font-semibold">
              Interview Shadow AI
            </p>
          </div>

        </div>

        {/* Progress */}

        <div className="w-full bg-gray-700 rounded-full h-3 mb-10">

          <div
            className="bg-purple-600 h-3 rounded-full"
            style={{
              width: `${((currentQuestion + 1) / questions.length) * 100}%`,
            }}
          ></div>

        </div>

        {/* AI Question */}

        <div className="bg-slate-800 rounded-2xl p-8 mb-8">

          <p className="text-sm text-purple-400 mb-3">
            AI Interviewer
          </p>

          <h2 className="text-2xl font-semibold">
            {questions[currentQuestion]}
          </h2>

        </div>

        {/* Answer */}

        <textarea
          rows="8"
          placeholder="Type your answer here..."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full bg-slate-800 rounded-2xl border border-gray-700 p-5 outline-none focus:border-purple-500 resize-none"
        />

        <div className="flex justify-end mt-8">

          <Button onClick={handleNext}>
            {currentQuestion === questions.length - 1
              ? "Finish Interview"
              : "Next Question"}
          </Button>

        </div>

      </div>

    </div>
  );
}

export default InterviewSession;