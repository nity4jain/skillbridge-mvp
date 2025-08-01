// skillbridge-mvp/client/pages/landing.tsx

import React from "react";
import Head from "next/head";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { signIn } from "next-auth/react";

const LandingPage = () => {
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
                SkillBridge is the AI-powered platform that connects your
                experience to real job opportunities and guides your learning journey.
              </p>
              <div className="flex justify-center lg:justify-start space-x-4 pt-4">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold shadow-xl">
                  Try a Demo
                </Button>
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600 font-semibold shadow-xl">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="lg:w-1/2 flex justify-center lg:justify-end mt-12 lg:mt-0">
              <img
                src="/placeholder-image.svg"
                alt="AI career guidance illustration"
                className="max-w-md w-full animate-fade-in"
              />
            </div>
          </div>
        </section>

        {/* --- How It Works Section --- */}
        <section className="py-20 bg-gray-50 p-6">
          <div className="container mx-auto text-center space-y-12">
            <h2 className="text-4xl font-bold text-gray-800">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="shadow-lg transform transition-all hover:scale-105">
                <CardHeader>
                  <div className="text-5xl text-blue-500 mb-4">
                    <span role="img" aria-label="upload">📄</span>
                  </div>
                  <CardTitle className="text-2xl">1. Upload Your Resume</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Our platform intelligently analyzes your skills, experience, and projects.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="shadow-lg transform transition-all hover:scale-105">
                <CardHeader>
                  <div className="text-5xl text-purple-500 mb-4">
                    <span role="img" aria-label="match">🎯</span>
                  </div>
                  <CardTitle className="text-2xl">2. Get Job Matches</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    AI matches your profile with thousands of real-world job listings instantly.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="shadow-lg transform transition-all hover:scale-105">
                <CardHeader>
                  <div className="text-5xl text-green-500 mb-4">
                    <span role="img" aria-label="bridge">🌉</span>
                  </div>
                  <CardTitle className="text-2xl">3. Bridge Skill Gaps</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Receive a personalized learning path to acquire the skills you need.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* --- AI-Powered Matching & Personalized Learning Path --- */}
        <section className="py-20 p-6">
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h3 className="text-sm font-semibold uppercase text-purple-600">
                AI-Powered
              </h3>
              <h2 className="text-4xl font-bold text-gray-800">
                Intelligent Matching, Not Just Keywords
              </h2>
              <p className="text-lg text-gray-600">
                Our proprietary AI goes beyond simple keyword matching. It understands the context of your experience and career goals to find the roles that truly fit you.
              </p>
            </div>
            <div>
              <img
                src="/placeholder-image-2.svg"
                alt="AI matching illustration"
                className="w-full h-auto rounded-xl shadow-2xl"
              />
            </div>
          </div>
          <Separator className="my-16" />
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <img
                src="/placeholder-image-3.svg"
                alt="GPT learning illustration"
                className="w-full h-auto rounded-xl shadow-2xl"
              />
            </div>
            <div className="order-1 md:order-2 space-y-6">
              <h3 className="text-sm font-semibold uppercase text-green-600">
                GPT-Enabled
              </h3>
              <h2 className="text-4xl font-bold text-gray-800">
                Your Personal AI Learning Coach
              </h2>
              <p className="text-lg text-gray-600">
                Using cutting-edge language models, SkillBridge generates custom, step-by-step learning paths with specific courses, tutorials, and certifications to fill your skill gaps.
              </p>
            </div>
          </div>
        </section>

        {/* --- Target Users Section --- */}
        <section className="py-20 bg-gray-50 p-6">
          <div className="container mx-auto text-center space-y-12">
            <h2 className="text-4xl font-bold text-gray-800">
              Who is SkillBridge for?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-6 shadow-lg transform transition-all hover:scale-105">
                <CardTitle className="text-2xl text-blue-600">
                  Students
                </CardTitle>
                <CardDescription className="mt-2 text-lg">
                  Launch your career by discovering what skills employers are
                  actually looking for and how to get them.
                </CardDescription>
              </Card>
              <Card className="p-6 shadow-lg transform transition-all hover:scale-105">
                <CardTitle className="text-2xl text-purple-600">
                  Job Seekers
                </CardTitle>
                <CardDescription className="mt-2 text-lg">
                  Stop endlessly searching. Find your perfect role and get the
                  learning roadmap to secure it.
                </CardDescription>
              </Card>
              <Card className="p-6 shadow-lg transform transition-all hover:scale-105">
                <CardTitle className="text-2xl text-green-600">
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
        <section className="py-20 p-6 bg-gray-800 text-white">
          <div className="container mx-auto text-center space-y-12">
            <h2 className="text-4xl font-bold">What Our Users Say</h2>
            <p className="text-xl max-w-3xl mx-auto text-gray-300">
              “SkillBridge helped me land my first job after graduation. The personalized learning path was a game-changer.”
            </p>
            <p className="text-lg font-semibold text-gray-400">
              — Jane Doe, Software Engineer
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8 text-lg font-semibold text-gray-400">
              <span className="flex items-center space-x-2">
                <span role="img" aria-label="star">⭐</span>
                <span>Trusted by 5,000+ users</span>
              </span>
              <span className="flex items-center space-x-2">
                <span role="img" aria-label="checkmark">✅</span>
                <span>Featured in TechCrunch</span>
              </span>
            </div>
          </div>
        </section>

        {/* --- Final CTA --- */}
        <section className="py-20 p-6 text-center bg-gradient-to-r from-blue-600 to-purple-700 text-white">
          <div className="container mx-auto space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold">
              Ready to Bridge Your Future?
            </h2>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto text-gray-100">
              Start your free demo today and get a personalized roadmap to your dream job.
            </p>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold shadow-xl mt-6">
              Get Started for Free
            </Button>
          </div>
        </section>
      </div>
    </>
  );
};

export default LandingPage;