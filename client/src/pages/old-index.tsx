// skillbridge-mvp/client/pages/index.tsx

import { useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import Head from "next/head";
import styles from "./index.module.css";
import Image from "next/image";
import AuthButton from "../components/AuthButton";
import { Inter } from 'next/font/google';
import { useRouter } from 'next/router'; // <<<--- ADD THIS IMPORT

const geistSans = Inter({ subsets: ['latin'], variable: '--font-sans' });
const geistMono = { variable: '' };

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter(); // <<<--- INITIALIZE ROUTER

  // <<<--- NEW: Redirect authenticated users to the analysis page
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/analyze"); // Redirect to your new analysis page
    }
  }, [status, router]);
  // <<<--- END NEW REDIRECT LOGIC

  // REMOVED: type Job = { ... }
  // REMOVED: const [matchedJobs, setMatchedJobs] = useState<Job[]>([]);
  // REMOVED: const fetchMatches = async () => { ... } // This logic moves to analyze.tsx if needed, or is replaced by AI analysis

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

          {/* REMOVED: The 'authenticated' block with Find Matching Jobs button and matchedJobs list */}
          {status === "authenticated" && (
            <p>Redirecting to your dashboard...</p> // Display this while redirecting
          )}
        </main>
      </div>
    </>
  );
}