import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  const email = session?.user?.email;

  if (req.method === "POST" && email) {
    const { role } = req.body;
    try {
      await prisma.user.update({
        where: { email },
        data: { role },
      });
      res.status(200).json({ success: true });
    } catch (err) {
      console.error("Failed to update role:", err);
      res.status(500).json({ error: "Failed to update role" });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}