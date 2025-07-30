// /client/pages/dashboard/junior.tsx

import { useState } from "react";

export default function JuniorDashboard() {
  const [profileText, setProfileText] = useState("");
  const [matches, setMatches] = useState<any[]>([]);

  async function fetchMatches(profileText: string) {
    try {
      const res = await fetch("http://localhost:5000/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: profileText }),
      });
      const jobs = await res.json();
      console.log("Top matches", jobs);
      setMatches(jobs);
    } catch (error) {
      console.error("Error fetching matches:", error);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">AI Job Matcher</h1>

      <textarea
        className="w-full p-2 border rounded mb-4"
        rows={4}
        placeholder="Paste your skills or resume text..."
        value={profileText}
        onChange={(e) => setProfileText(e.target.value)}
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => fetchMatches(profileText)}
      >
        Find Jobs
      </button>

      <div className="mt-6 space-y-4">
        {matches.map((job) => (
          <div key={job.id} className="p-4 border rounded shadow bg-white">
            <h2 className="text-lg font-semibold">
              {job.title} @ {job.company}
            </h2>
            <p className="text-sm text-gray-700">{job.description}</p>
            <p className="mt-1">
              <strong>Location:</strong> {job.location}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}