import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Button from "../components/Button";

function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">

      <Navbar />

      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center text-center px-6 py-24">

        <p className="text-purple-400 font-semibold tracking-widest uppercase">
          AI Powered Mock Interview Platform
        </p>

        <h1 className="text-5xl md:text-7xl font-extrabold mt-6 leading-tight">
          Ace Your
          <span className="text-purple-500"> Dream Interview</span>
        </h1>

        <p className="text-gray-400 max-w-3xl mt-8 text-lg leading-8">
          Practice company-specific mock interviews, upload your resume,
          answer adaptive AI questions, and receive an instant professional
          scorecard with personalized feedback.
        </p>

        <div className="flex gap-5 mt-10 flex-wrap justify-center">
          <Link to="/login">
            <Button>Start Interview</Button>
          </Link>

          <a href="#features">
            <button className="border border-gray-700 px-6 py-3 rounded-xl hover:bg-gray-900 transition">
              Learn More
            </button>
          </a>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="px-10 py-20 bg-slate-900"
      >
        <h2 className="text-4xl font-bold text-center mb-14">
          Why Choose Interview Shadow AI?
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          <div className="bg-slate-800 rounded-2xl p-8 hover:scale-105 transition">
            <div className="text-5xl mb-5">🤖</div>
            <h3 className="text-xl font-semibold mb-3">
              AI Interviewer
            </h3>
            <p className="text-gray-400">
              Conducts realistic company-style mock interviews using GPT.
            </p>
          </div>

          <div className="bg-slate-800 rounded-2xl p-8 hover:scale-105 transition">
            <div className="text-5xl mb-5">📄</div>
            <h3 className="text-xl font-semibold mb-3">
              Resume Analysis
            </h3>
            <p className="text-gray-400">
              Tailors interview questions according to your uploaded resume.
            </p>
          </div>

          <div className="bg-slate-800 rounded-2xl p-8 hover:scale-105 transition">
            <div className="text-5xl mb-5">🎯</div>
            <h3 className="text-xl font-semibold mb-3">
              Adaptive Questions
            </h3>
            <p className="text-gray-400">
              AI asks follow-up questions based on your previous answers.
            </p>
          </div>

          <div className="bg-slate-800 rounded-2xl p-8 hover:scale-105 transition">
            <div className="text-5xl mb-5">📊</div>
            <h3 className="text-xl font-semibold mb-3">
              AI Scorecard
            </h3>
            <p className="text-gray-400">
              Receive detailed feedback on communication, confidence and technical skills.
            </p>
          </div>

        </div>
      </section>

      {/* How It Works */}
      <section className="px-10 py-20">

        <h2 className="text-4xl font-bold text-center mb-16">
          How It Works
        </h2>

        <div className="grid md:grid-cols-4 gap-8 text-center">

          <div>
            <div className="text-5xl mb-4">1️⃣</div>
            <h3 className="font-semibold text-xl">Login</h3>
            <p className="text-gray-400 mt-2">
              Create your account securely.
            </p>
          </div>

          <div>
            <div className="text-5xl mb-4">2️⃣</div>
            <h3 className="font-semibold text-xl">
              Upload Resume
            </h3>
            <p className="text-gray-400 mt-2">
              Upload your latest resume.
            </p>
          </div>

          <div>
            <div className="text-5xl mb-4">3️⃣</div>
            <h3 className="font-semibold text-xl">
              AI Interview
            </h3>
            <p className="text-gray-400 mt-2">
              Answer intelligent adaptive interview questions.
            </p>
          </div>

          <div>
            <div className="text-5xl mb-4">4️⃣</div>
            <h3 className="font-semibold text-xl">
              Get Feedback
            </h3>
            <p className="text-gray-400 mt-2">
              Improve with an AI-generated scorecard.
            </p>
          </div>

        </div>

      </section>

      <Footer />

    </div>
  );
}

export default LandingPage;