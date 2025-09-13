import React from "react";
import Head from "next/head";
import Image from "next/image"; // <-- Import Image
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const LandingPage = () => {
  const { status } = useSession();
  const router = useRouter();

  const handleGetStartedClick = () => {
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
        <meta name="description" content="Bridge your skills to your dream career with AI-powered guidance." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col min-h-screen bg-white text-gray-800">
        {/* --- Hero Section --- */}
        <section className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-white p-6">
          <div className="container relative z-10 flex flex-col lg:flex-row items-center justify-between text-center lg:text-left">
            <div className="lg:w-1/2 max-w-2xl space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Bridge Your Skills. Land Your Dream Job.
              </h1>
              <p className="text-lg md:text-xl text-gray-200">
                SkillBridge is the AI-powered platform that connects your experience to real job opportunities and guides your learning journey.
              </p>
              <div className="flex justify-center lg:justify-start space-x-4 pt-4">
                <Button onClick={handleGetStartedClick} size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold shadow-xl">
                  Get Started
                </Button>
              </div>
            </div>
            <div className="lg:w-1/2 flex justify-center lg:justify-end mt-12 lg:mt-0">
              <Image
                src="/hero-image.png"
                alt="AI career guidance illustration"
                width={500}
                height={500}
                className="max-w-md w-full"
              />
            </div>
          </div>
        </section>

        {/* --- AI-Powered Matching & Learning Path --- */}
        <section className="py-20 p-6">
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h3 className="text-sm font-semibold uppercase text-purple-600">AI-Powered</h3>
              <h2 className="text-4xl font-bold text-gray-800">Intelligent Matching, Not Just Keywords</h2>
              <p className="text-lg text-gray-600">Our proprietary AI understands the context of your experience and career goals to find the roles that truly fit you.</p>
            </div>
            <div>
              <Image
                src="/ai-matching.png"
                alt="AI matching illustration"
                width={500}
                height={400}
                className="w-full h-auto rounded-xl shadow-2xl"
              />
            </div>
          </div>
          <Separator className="my-16" />
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <Image
                src="/ai-learning.png"
                alt="AI learning illustration"
                width={500}
                height={400}
                className="w-full h-auto rounded-xl shadow-2xl"
              />
            </div>
            <div className="order-1 md:order-2 space-y-6">
              <h3 className="text-sm font-semibold uppercase text-green-600">AI-Enabled</h3>
              <h2 className="text-4xl font-bold text-gray-800">Your Personal AI Learning Coach</h2>
              <p className="text-lg text-gray-600">Using cutting-edge language models, SkillBridge generates custom learning paths to fill your skill gaps.</p>
            </div>
          </div>
        </section>

        {/* --- Final CTA --- */}
        <section className="py-20 p-6 text-center bg-gradient-to-r from-blue-600 to-purple-700 text-white">
          <div className="container mx-auto space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold">Ready to Bridge Your Future?</h2>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto text-gray-100">Start your free demo today and get a personalized roadmap to your dream job.</p>
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