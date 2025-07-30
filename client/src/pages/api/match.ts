import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { prisma } from "../../../prisma/prisma"; // adjust path as needed

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userEmail = session.user?.email;

  if (typeof userEmail !== "string") {
    return res.status(400).json({ message: "User email not found or invalid" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user || !user.skills) {
      return res.status(400).json({ message: "User skills not found in database" });
    }

    const profileText = user.skills;

    const response = await fetch("http://localhost:5000/match", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile: profileText }),
    });

    const data = await response.json();

    console.log("AI Matching result:", data);

    if (!Array.isArray(data)) {
      return res.status(500).json({ message: "Invalid response format from match engine" });
    }

    return res.status(200).json({ jobs: data });
  } catch (error) {
    console.error("Match API error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
