import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import Head from "next/head";
import styles from "./index.module.css";
import Image from "next/image";
import AuthButton from "../components/AuthButton";
import { Inter } from 'next/font/google';

const geistSans = Inter({ subsets: ['latin'], variable: '--font-sans' });
const geistMono = { variable: '' };

export default function Home() {
  const { data: session, status } = useSession();
  type Job = {
    title: string;
    company: string;
    location: string;
    // add other fields if needed
  };

  const [matchedJobs, setMatchedJobs] = useState<Job[]>([]);

  const fetchMatches = async () => {
    try {
      const res = await fetch("http://localhost:5000/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: "junior developer skilled in React and Node.js",
        }),
      });

      const jobs = await res.json();
      console.log("Top matches", jobs);
      setMatchedJobs(jobs);
    } catch (err) {
      console.error("Error fetching matches:", err);
    }
  };

  return (
    <>
      <Head>
        <title>SkillBridge</title>
        <meta name="description" content="Match your skills with jobs" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        className={`${styles.page} ${geistSans.variable} ${geistMono.variable}`}
      >
        <main className={styles.main}>
          <Image
            className={styles.logo}
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />

          <AuthButton />

          {status === "loading" && <p>Loading session...</p>}

          {status === "unauthenticated" && (
            <>
              <p>Sign in to continue to your dashboard.</p>
              <button
                onClick={() => signIn("google")}
                style={{ marginTop: "20px" }}
              >
                Sign in with Google
              </button>
            </>
          )}

          {status === "authenticated" && (
            <>
              <p>Welcome, {session.user?.name}! Click below to find jobs.</p>
              <button onClick={fetchMatches} style={{ marginTop: "20px" }}>
                Find Matching Jobs
              </button>

              <ul style={{ marginTop: "20px" }}>
                {matchedJobs.map((job, index) => (
                  <li key={index}>
                    <strong>{job.title}</strong> at {job.company} — {job.location}
                  </li>
                ))}
              </ul>
            </>
          )}
        </main>
      </div>
    </>
  );
}
