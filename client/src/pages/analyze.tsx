// skillbridge-mvp/client/pages/analyze.tsx

import React, { useState } from 'react';
import axios from 'axios'; // Ensure axios is installed (npm install axios)
import { Toaster, toast } from 'sonner'; // Ensure sonner is installed (npm install sonner)
import { useSession } from 'next-auth/react'; // To get session info for potential user tracking

// Define types for the expected API response structure
type MatchedJob = {
  title: string;
  score: number;
};

type LearningPath = {
  skill_gap: string;
  recommendations: string[];
};

type AnalysisResult = {
  filename?: string;
  content_preview?: string;
  extracted_skills: string[];
  matched_jobs: MatchedJob[];
  skill_gaps?: string[]; // Optional, depending on your Python AI output
  learning_paths: LearningPath[];
  message?: string; // Optional, for general messages
};

const AnalyzePage: React.FC = () => {
  const { data: session, status } = useSession(); // Get user session info
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState<string>('');
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // --- IMPORTANT: Your NestJS Backend URL ---
  const NESTJS_API_BASE_URL = 'http://localhost:5000/api'; // CONFIRM THIS IS CORRECT

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setResumeFile(event.target.files[0]);
      setResumeText(''); // Clear text input if file is chosen
    }
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResumeText(event.target.value);
    setResumeFile(null); // Clear file input if text is typed
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setResults(null);
    setError(null);

    // Basic validation before sending request
    if (!resumeFile && (!resumeText || resumeText.trim() === '')) {
      setError("Please upload a resume file or paste your text.");
      toast.error("No input provided!");
      setLoading(false);
      return;
    }

    try {
      let response;
      if (resumeFile) {
        // Send file to NestJS /api/analysis/file-upload
        const formData = new FormData();
        formData.append('file', resumeFile); // 'file' must match the field name in NestJS controller
        response = await axios.post(`${NESTJS_API_BASE_URL}/analysis/file-upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data', // Axios usually handles this with FormData
          },
        });
        toast.success("Resume file uploaded and analyzed!");
      } else if (resumeText) {
        // Send text to NestJS /api/analysis/text
        response = await axios.post(`${NESTJS_API_BASE_URL}/analysis/text`, {
          content: resumeText, // 'content' must match the DTO property in NestJS
        });
        toast.success("Resume text analyzed!");
      } else {
        return; // Should not reach here due to earlier validation
      }

      setResults(response.data as AnalysisResult); // Type assertion for safety

    } catch (err: any) {
      console.error("API call failed:", err);
      setError(err.response?.data?.message || err.message || "An unknown error occurred.");
      toast.error("Analysis failed: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Optional: Redirect unauthenticated users or show sign-in prompt
  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-xl">Loading session...</div>;
  }
  if (status === "unauthenticated") {
    // You might have a dedicated login page or show a prompt here
    // For now, let's just indicate they need to sign in
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-6">Please sign in to use SkillBridge's powerful analysis tools.</p>
        {/* You could add a sign-in button here if not on the main index */}
        <a href="/" className="text-blue-600 hover:underline">Go to Sign In Page</a>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-3xl font-sans bg-gray-50 min-h-screen">
      <Toaster position="top-right" /> {/* Sonner toast component */}
      <h1 className="text-4xl font-bold text-center mb-8 text-blue-800">SkillBridge AI Analyst</h1>
      <p className="text-center text-gray-600 mb-6">Welcome, {session?.user?.name}! Let's analyze your profile and find your path.</p>

      {/* Input Section */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-10">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Your Profile Input</h2>

        <div className="mb-6">
          <label htmlFor="resumeFileUpload" className="block text-lg font-medium text-gray-700 mb-3">
            1. Upload your Resume (PDF or DOCX):
          </label>
          <input
            type="file"
            id="resumeFileUpload"
            accept=".pdf,.docx"
            onChange={handleFileChange}
            className="mt-1 block w-full text-base text-gray-700 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-base file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer transition duration-150 ease-in-out"
          />
        </div>

        <div className="mb-8 relative flex items-center">
          <span className="flex-grow border-t border-gray-300"></span>
          <span className="flex-shrink mx-4 text-gray-500 text-sm font-medium">OR</span>
          <span className="flex-grow border-t border-gray-300"></span>
        </div>

        <div className="mb-6">
          <label htmlFor="resumeTextInput" className="block text-lg font-medium text-gray-700 mb-3">
            2. Paste your skills & experience:
          </label>
          <textarea
            id="resumeTextInput"
            value={resumeText}
            onChange={handleTextChange}
            rows={12}
            className="mt-1 block w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base resize-y font-mono"
            placeholder="e.g., 'Experienced Python developer with a strong background in data analysis and machine learning. Proficient in SQL, Docker, and AWS. Seeking roles in data science or backend engineering with a focus on cloud solutions...'"
          ></textarea>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading || (!resumeFile && (!resumeText || resumeText.trim() === ''))}
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-700 text-white font-semibold rounded-lg shadow-xl hover:from-blue-700 hover:to-purple-800 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition duration-200 ease-in-out transform hover:scale-105"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </span>
          ) : (
            'Analyze My Profile'
          )}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-8 shadow-sm" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline ml-2">{error}</span>
        </div>
      )}

      {/* Results Display */}
      {results && (
        <div className="mt-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-3xl font-bold mb-6 text-green-700 border-b pb-3">Analysis Report</h2>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-3">Extracted Skills:</h3>
            <p className="text-gray-900 bg-green-50 p-4 rounded-lg border border-green-200 text-lg">
              {results.extracted_skills && results.extracted_skills.length > 0 ? results.extracted_skills.join(', ') : 'No skills extracted.'}
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-3">Top Matching Job Roles:</h3>
            {results.matched_jobs && results.matched_jobs.length > 0 ? (
              <ul className="list-disc pl-6 space-y-3">
                {results.matched_jobs.map((job: MatchedJob) => (
                  <li key={job.title} className="text-gray-900 bg-blue-50 p-4 rounded-lg border border-blue-200 text-lg flex justify-between items-center">
                    <span className="font-medium">{job.title}</span>
                    <span className="bg-blue-200 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">Score: {(job.score * 100).toFixed(1)}%</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-800 bg-orange-50 p-4 rounded-lg border border-orange-200 text-lg">No specific job roles matched. Try adding more details to your profile.</p>
            )}
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-3">Personalized Learning Paths:</h3>
            {results.learning_paths && results.learning_paths.length > 0 ? (
              <div className="space-y-6">
                {results.learning_paths.map((lp: LearningPath, index: number) => (
                  <div key={index} className="bg-purple-50 p-5 rounded-xl border border-purple-200 shadow-sm">
                    <h4 className="font-bold text-lg text-purple-800 mb-2">Skill Gap: {lp.skill_gap}</h4>
                    <ul className="list-decimal pl-6 text-gray-800 space-y-1">
                      {lp.recommendations && lp.recommendations.length > 0 ? (
                        lp.recommendations.map((rec: string, recIndex: number) => (
                          <li key={recIndex} className="text-base">{rec}</li>
                        ))
                      ) : (
                        <li className="text-base">No specific recommendations available.</li>
                      )}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-800 bg-green-50 p-4 rounded-lg border border-green-200 text-lg">No immediate skill gaps identified. Great job!</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyzePage;