// skillbridge-mvp/client/pages/analyze.tsx

import React, { useState } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'sonner';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

// Import Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

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
  skill_gaps?: string[];
  learning_paths: LearningPath[];
  message?: string;
};

const AnalyzePage: React.FC = () => {
  const { data: session, status } = useSession();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState<string>('');
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const NESTJS_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setResumeFile(event.target.files[0]);
      setResumeText('');
    }
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResumeText(event.target.value);
    setResumeFile(null);
  };

  const handleAnalyze = async () => {
    if (!session?.accessToken) {
        toast.error('Authentication error. Please log in again.');
        return;
    }
    
    setLoading(true);
    setResults(null);
    setError(null);

    if (!resumeFile && !resumeText.trim()) {
      setError("Please upload a resume file or paste your text.");
      toast.error("No input provided!");
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      };

      let response;
      if (resumeFile) {
        const formData = new FormData();
        formData.append('file', resumeFile);
        response = await axios.post(`${NESTJS_API_BASE_URL}/analysis/file-upload`, formData, config);
        toast.success("Resume file analyzed successfully!");
      } else {
        response = await axios.post(`${NESTJS_API_BASE_URL}/analysis/text`, { content: resumeText }, config);
        toast.success("Resume text analyzed successfully!");
      }

      setResults(response.data as AnalysisResult);

    } catch (err: unknown) {
      let errorMessage = "An unknown error occurred.";

      // This is a manual, safe way to check for an Axios error that is guaranteed to work
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } }, message?: string };
        errorMessage = axiosError.response?.data?.message || axiosError.message || "An error occurred with the API request.";
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      console.error("API call failed:", err);
      setError(errorMessage);
      toast.error(`Analysis failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-xl">Loading session...</div>;
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-6">Please sign in to use SkillBridge&apos;s powerful analysis tools.</p>
        <Link href="/" className="text-blue-600 hover:underline">Go to Sign In Page</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-3xl font-sans bg-gray-50 min-h-screen flex flex-col items-center">
      <Toaster position="top-right" />

      <Card className="w-full max-w-3xl mt-8 mb-4">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="text-3xl text-blue-800">SkillBridge AI Analyst</CardTitle>
          {session?.user?.name && <p className="text-gray-600">Welcome, {session.user.name}!</p>}
          <Button variant="outline" onClick={() => signOut({ callbackUrl: '/' })}>Logout</Button>
        </CardHeader>
        <CardDescription className="text-center pb-4">Empowering your career journey with AI-driven insights.</CardDescription>
      </Card>

      <Card className="w-full max-w-3xl mb-10 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-800">Your Profile Input</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="mb-4">
              <Label htmlFor="resumeFileUpload" className="block text-lg font-medium text-gray-700 mb-2">
                1. Upload your Resume (PDF or DOCX):
              </Label>
              <Input
                id="resumeFileUpload"
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
            </div>

            <div className="relative flex items-center mb-6">
              <span className="flex-grow border-t border-gray-300"></span>
              <span className="flex-shrink mx-4 text-gray-500 text-sm font-medium">OR</span>
              <span className="flex-grow border-t border-gray-300"></span>
            </div>

            <div className="mb-4">
              <Label htmlFor="resumeTextInput" className="block text-lg font-medium text-gray-700 mb-2">
                2. Paste your skills & experience:
              </Label>
              <Textarea
                id="resumeTextInput"
                value={resumeText}
                onChange={handleTextChange}
                rows={8}
                placeholder="e.g., &apos;Experienced Python developer...&apos;"
                className="min-h-[150px]"
              />
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={loading || (!resumeFile && !resumeText.trim())}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-700 text-white font-semibold shadow-lg hover:from-blue-700 hover:to-purple-800 disabled:opacity-60 disabled:cursor-not-allowed transition duration-200 ease-in-out transform hover:scale-105"
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
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-8 shadow-sm" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline ml-2">{error}</span>
        </div>
      )}

      {results && (
        <Card className="w-full max-w-3xl mb-10 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-green-700">Analysis Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-3">Extracted Skills:</h3>
              <div className="text-gray-900 bg-green-50 p-4 rounded-lg border border-green-200 text-lg">
                {results.extracted_skills && results.extracted_skills.length > 0 ? results.extracted_skills.join(', ') : 'No skills extracted.'}
              </div>
            </div>

            <div className="mb-6">
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
                    <Card key={index} className="bg-purple-50 p-5 border border-purple-200 shadow-sm">
                      <CardHeader className="p-0 mb-2">
                        <CardTitle className="font-bold text-lg text-purple-800">Skill Gap: {lp.skill_gap}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <ul className="list-decimal pl-6 text-gray-800 space-y-1">
                          {lp.recommendations && lp.recommendations.length > 0 ? (
                            lp.recommendations.map((rec: string, recIndex: number) => (
                              <li key={recIndex} className="text-base">{rec}</li>
                            ))
                          ) : (
                            <li className="text-base">No specific recommendations available.</li>
                          )}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-gray-800 bg-green-50 p-4 rounded-lg border border-green-200 text-lg">No immediate skill gaps identified. Great job!</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AnalyzePage;