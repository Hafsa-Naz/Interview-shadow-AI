import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaFilePdf, FaUpload } from "react-icons/fa";
import Button from "../components/Button";

function ResumeUpload() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const handleFile = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Only PDF, DOC, and DOCX files are allowed.");
      return;
    }

    setError("");
    setFile(selectedFile);
  };

  const handleContinue = () => {
    if (!file) {
      setError("Please upload your resume first.");
      return;
    }

    // Backend upload will be added later
    navigate("/interview");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex justify-center items-center px-6">

      <div className="bg-slate-900 w-full max-w-xl rounded-3xl p-10 shadow-2xl">

        <h1 className="text-4xl font-bold text-white text-center">
          Upload Resume
        </h1>

        <p className="text-center text-gray-400 mt-3 mb-8">
          Upload your latest resume to personalize your interview.
        </p>

        <label
          className="border-2 border-dashed border-purple-500 rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-800 transition"
        >
          <FaUpload className="text-5xl text-purple-400 mb-4" />

          <p className="text-lg text-white font-semibold">
            Click to Upload
          </p>

          <p className="text-gray-400 mt-2">
            PDF • DOC • DOCX
          </p>

          <input
            type="file"
            className="hidden"
            onChange={handleFile}
          />
        </label>

        {file && (
          <div className="bg-slate-800 rounded-xl mt-8 p-4 flex items-center gap-4">

            <FaFilePdf className="text-red-500 text-3xl" />

            <div>
              <h3 className="text-white font-semibold">
                {file.name}
              </h3>

              <p className="text-gray-400 text-sm">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>

          </div>
        )}

        {error && (
          <div className="mt-6 bg-red-500/20 border border-red-500 rounded-xl p-3 text-red-300">
            {error}
          </div>
        )}

        <Button
          className="w-full mt-8"
          onClick={handleContinue}
        >
          Continue
        </Button>

      </div>

    </div>
  );
}

export default ResumeUpload;