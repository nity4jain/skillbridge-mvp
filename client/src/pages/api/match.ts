import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]"; // adjust if needed
import { prisma } from "../../../prisma/prisma"; // adjust the relative path as needed

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { profile: true }, // assuming you have a separate Profile table or embedded field
  });

  if (!user || !user.profile?.summary) {
    return res.status(400).json({ message: "User profile not found or incomplete" });
  }

  const profileText = user.profile.summary;

  try {
    const response = await fetch("http://localhost:5000/match", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile: profileText }),
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error("Matching engine error:", err);
    return res.status(500).json({ message: "Matching engine failed" });
  }
}
