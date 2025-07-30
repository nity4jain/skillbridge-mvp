import React from "react";
// If you meant to use the 'sonner' package, install it and import as follows:
import { Toaster as Sonner } from "sonner";

// Or, if you have a local Toaster component, correct the path:
// import { Toaster as Sonner } from "../components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Head from "next/head";

const queryClient = new QueryClient();

export default function LandingPage() {
  return (
    <>
      <Head>
        <title>Cosmos Haven</title>
        <meta name="description" content="Empowering your career journey" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Sonner />
          <main className="min-h-screen bg-white text-center p-8">
            <h1 className="text-4xl font-bold mt-10">Welcome to Cosmos Haven</h1>
            <p className="mt-4 text-gray-600">Empowering your career journey</p>
          </main>
        </TooltipProvider>
      </QueryClientProvider>
    </>
  );
}
