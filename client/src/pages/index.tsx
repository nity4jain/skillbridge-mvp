// skillbridge-mvp/client/pages/landing.tsx

import React from "react";
import Head from "next/head";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from 'next/image';

const LandingPage = () => {
  const { status } = useSession();
  const router = useRouter();

  const handleCtaClick = () => {
    if (status === "authenticated") {
      router.push("/analyze");
    } else {
      signIn("google", { callbackUrl: "/analyze" });
    }
  };

  return (
    <>
      <Head>
        <title>SkillBridge - AI Career Guidance</title>
        <meta
          name="description"
          content="Bridge your skills to your dream career with AI-powered guidance."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col min-h-screen bg-white text-gray-800 font-sans">
        {/* --- Hero Section --- */}
        <section className="relative flex items-center justify-center min-h-screen bg-white text-black p-6 md:p-12">
          <div className="container relative z-10 flex flex-col lg:flex-row items-center justify-between text-center lg:text-left space-y-12 lg:space-y-0">
            <div className="lg:w-1/2 max-w-2xl space-y-8">
              <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tighter">
                The AI-Powered Career Bridge.
              </h1>
              <p className="text-lg md:text-xl text-gray-600">
                Match your skills to your dream job, and let our AI build your
                personalized learning roadmap.
              </p>
              <div className="flex justify-center lg:justify-start space-x-4 pt-4">
                <Button onClick={handleCtaClick} size="lg" className="bg-blue-600 text-white hover:bg-blue-700 font-semibold shadow-xl transition-all">
                  Get Started for Free
                </Button>
                <Button size="lg" variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50 font-semibold shadow-xl transition-all">
                  Try a Demo
                </Button>
              </div>
            </div>
            <div className="lg:w-1/2 flex justify-center lg:justify-end">
              <Image
                src="/hero-image.png"
                alt="AI career guidance dashboard"
                className="max-w-xl w-full rounded-3xl shadow-2xl animate-fade-in"
                width={500}
                height={500}
              />
            </div>
          </div>
        </section>

        {/* --- How It Works Section --- */}
        <section className="py-24 bg-gray-50 p-6 md:p-12">
          <div className="container mx-auto text-center space-y-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
              How SkillBridge Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <Card className="p-8 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-none">
                <CardHeader className="p-0">
                  <div className="text-5xl text-blue-500 mb-4 mx-auto">
                    <span role="img" aria-label="upload">1.📄</span>
                  </div>
                  <CardTitle className="text-2xl font-semibold">Upload Your Profile</CardTitle>
                </CardHeader>
                <CardContent className="p-0 mt-4">
                  <CardDescription>
                    Provide your resume or skills. Our AI analyzes your experience in seconds.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="p-8 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-none">
                <CardHeader className="p-0">
                  <div className="text-5xl text-purple-500 mb-4 mx-auto">
                    <span role="img" aria-label="match">2.🎯</span>
                  </div>
                  <CardTitle className="text-2xl font-semibold">Get Job Matches</CardTitle>
                </CardHeader>
                <CardContent className="p-0 mt-4">
                  <CardDescription>
                    We match your unique profile to real, in-demand jobs from across the web.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="p-8 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-none">
                <CardHeader className="p-0">
                  <div className="text-5xl text-green-500 mb-4 mx-auto">
                    <span role="img" aria-label="bridge">3.🌉</span>
                  </div>
                  <CardTitle className="text-2xl font-semibold">Bridge Your Skill Gaps</CardTitle>
                </CardHeader>
                <CardContent className="p-0 mt-4">
                  <CardDescription>
                    Receive a personalized learning roadmap with courses and resources to get you ready.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* --- AI-Powered Matching & Personalized Learning Path --- */}
        <section className="py-24 p-6 md:p-12">
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h3 className="text-sm font-semibold uppercase text-purple-600">
                Intelligent Matching
              </h3>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
                Beyond Keywords. Beyond Resumes.
              </h2>
              <p className="text-lg text-gray-600">
                Our proprietary AI understands the context and future potential of your skills. It&apos;s not just about what you&apos;ve done, but what you can do next.
              </p>
            </div>
            <div>
              <Image
                src="/placeholder-image-2.svg"
                alt="AI matching illustration"
                className="w-full h-auto rounded-3xl shadow-2xl"
                width={500}
                height={500}
              />
            </div>
          </div>
          <Separator className="my-24 bg-gray-200" />
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <Image
                src="/placeholder-image-3.svg"
                alt="GPT learning illustration"
                className="w-full h-auto rounded-3xl shadow-2xl"
                width={500}
                height={500}
              />
            </div>
            <div className="order-1 md:order-2 space-y-6">
              <h3 className="text-sm font-semibold uppercase text-green-600">
                Your AI Learning Coach
              </h3>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
                Personalized Learning, Powered by GPT
              </h2>
              <p className="text-lg text-gray-600">
                We identify your skill gaps and generate a custom learning roadmap just for you, complete with recommended courses and certifications.
              </p>
            </div>
          </div>
        </section>

        {/* --- Target Users Section --- */}
        <section className="py-24 bg-gray-50 p-6 md:p-12">
          <div className="container mx-auto text-center space-y-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
              Who is SkillBridge for?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-8 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-none">
                <CardTitle className="text-2xl font-semibold text-blue-600">
                  Students
                </CardTitle>
                <CardDescription className="mt-2 text-lg">
                  Launch your career by discovering what skills employers are
                  actually looking for and how to get them.
                </CardDescription>
              </Card>
              <Card className="p-8 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-none">
                <CardTitle className="text-2xl font-semibold text-purple-600">
                  Job Seekers
                </CardTitle>
                <CardDescription className="mt-2 text-lg">
                  Stop endlessly searching. Find your perfect role and get the
                  learning roadmap to secure it.
                </CardDescription>
              </Card>
              <Card className="p-8 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-none">
                <CardTitle className="text-2xl font-semibold text-green-600">
                  Career Switchers
                </CardTitle>
                <CardDescription className="mt-2 text-lg">
                  Make a seamless transition into a new industry with a clear
                  plan and targeted skill development.
                </CardDescription>
              </Card>
            </div>
          </div>
        </section>

        {/* --- Testimonials & Trust --- */}
        <section className="py-24 p-6 md:p-12 bg-gray-800 text-white">
          <div className="container mx-auto text-center space-y-16">
            <h2 className="text-4xl md:text-5xl font-bold">
              What Our Users Say
            </h2>
            <Card className="p-12 mx-auto max-w-4xl bg-white text-gray-800 shadow-xl border-none">
              <blockquote className="text-xl md:text-2xl font-medium italic mb-6">
                “SkillBridge helped me land my first job after graduation. The personalized learning path was a game-changer.”
              </blockquote>
              <footer className="text-lg font-semibold text-gray-600">
                — Jane Doe, Software Engineer
              </footer>
            </Card>
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-12 text-lg font-semibold text-gray-300">
              <span className="flex items-center space-x-2">
                <span className="text-2xl">⭐</span>
                <span>Trusted by 5,000+ users</span>
              </span>
              <span className="flex items-center space-x-2">
                <span className="text-2xl">✅</span>
                <span>Featured in TechCrunch</span>
              </span>
            </div>
          </div>
        </section>

        {/* --- Final CTA --- */}
        <section className="py-24 p-6 md:p-12 text-center bg-gradient-to-r from-blue-600 to-purple-700 text-white">
          <div className="container mx-auto space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold">
              Ready to Bridge Your Future?
            </h2>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto text-gray-100">
              Start your free demo today and get a personalized roadmap to your dream job.
            </p>
            <Button size="lg" onClick={handleCtaClick} className="bg-white text-blue-600 hover:bg-gray-100 font-semibold shadow-xl mt-6">
              Get Started for Free
            </Button>
          </div>
        </section>
      </div>
    </>
  );
};

export default LandingPage;