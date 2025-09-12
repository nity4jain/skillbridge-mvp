import React from "react";
import Head from "next/head";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const LandingPage = () => {
  const { status } = useSession();
  const router = useRouter();

  // This function handles the logic for the main call-to-action buttons
  const handleGetStartedClick = () => {
    if (status === "authenticated") {
      // If the user is already logged in, send them to the analyze page
      router.push("/analyze");
    } else {
      // If they're not logged in, start the Google sign-in process
      // After they sign in, they will be redirected to the analyze page
      signIn("google", { callbackUrl: "/analyze" });
    }
  };

  return (
    <>
      <Head>
        <title>SkillBridge - AI Career Guidance</title>
        <meta name="description" content="Bridge your skills to your dream career with AI-powered guidance." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col min-h-screen bg-white text-gray-800">
        {/* --- Hero Section --- */}
        <section className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-white p-6">
          <div className="absolute inset-0 z-0 opacity-10 bg-[url('/hero-pattern.svg')] bg-repeat"></div>
          <div className="container relative z-10 flex flex-col lg:flex-row items-center justify-between text-center lg:text-left">
            <div className="lg:w-1/2 max-w-2xl space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Bridge Your Skills. Land Your Dream Job.
              </h1>
              <p className="text-lg md:text-xl text-gray-200">
                SkillBridge is the AI-powered platform that connects your experience to real job opportunities and guides your learning journey.
              </p>
              <div className="flex justify-center lg:justify-start space-x-4 pt-4">
                {/* --- UPDATED BUTTON --- */}
                <Button onClick={handleGetStartedClick} size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold shadow-xl">
                  Try a Demo
                </Button>
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600 font-semibold shadow-xl">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="lg:w-1/2 flex justify-center lg:justify-end mt-12 lg:mt-0">
              <img
                src="/hero-image.png"
                alt="AI career guidance illustration"
                className="max-w-md w-full animate-fade-in"
              />
            </div>
          </div>
        </section>

        {/* --- The rest of your page sections (How It Works, etc.) --- */}
        {/* ... (no changes needed for the sections below) ... */}
        
        {/* --- How It Works Section --- */}
        <section className="py-20 bg-gray-50 p-6">
          {/* ... content ... */}
        </section>

        {/* --- AI-Powered Matching & Personalized Learning Path --- */}
        <section className="py-20 p-6">
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h3 className="text-sm font-semibold uppercase text-purple-600">AI-Powered</h3>
              <h2 className="text-4xl font-bold text-gray-800">Intelligent Matching, Not Just Keywords</h2>
              <p className="text-lg text-gray-600">Our proprietary AI goes beyond simple keyword matching. It understands the context of your experience and career goals to find the roles that truly fit you.</p>
            </div>
            <div>
              <img
                src="/ai-matching.png"
                alt="AI matching illustration"
                className="w-full h-auto rounded-xl shadow-2xl"
              />
            </div>
          </div>
          <Separator className="my-16" />
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <img
                src="/ai-learning.png"
                alt="GPT learning illustration"
                className="w-full h-auto rounded-xl shadow-2xl"
              />
            </div>
            <div className="order-1 md:order-2 space-y-6">
              <h3 className="text-sm font-semibold uppercase text-green-600">AI-Enabled</h3>
              <h2 className="text-4xl font-bold text-gray-800">Your Personal AI Learning Coach</h2>
              <p className="text-lg text-gray-600">Using cutting-edge language models, SkillBridge generates custom, step-by-step learning paths with specific courses, tutorials, and certifications to fill your skill gaps.</p>
            </div>
          </div>
        </section>

        {/* ... (Target Users, Testimonials sections) ... */}

        {/* --- Final CTA --- */}
        <section className="py-20 p-6 text-center bg-gradient-to-r from-blue-600 to-purple-700 text-white">
          <div className="container mx-auto space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold">Ready to Bridge Your Future?</h2>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto text-gray-100">Start your free demo today and get a personalized roadmap to your dream job.</p>
            {/* --- UPDATED BUTTON --- */}
            <Button onClick={handleGetStartedClick} size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold shadow-xl mt-6">
              Get Started for Free
            </Button>
          </div>
        </section>
      </div>
    </>
  );
};

export default LandingPage;