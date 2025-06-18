// client/src/pages/api/user.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../prisma/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = await prisma.user.findFirst(); // You can filter by email if needed

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      name: user.name,
      email: user.email,
      bio: user.bio,
      skills: user.skills,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
