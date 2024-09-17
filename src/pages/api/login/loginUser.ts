import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/infraestructure/postgressDB/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { user_name, user_password } = req.body;

    if (!user_name || !user_password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    try {
      const user = await prisma.user.findFirst({
        where: {
          user_name: user_name,
          user_password: user_password, // In production, you should hash the password instead
          status: true,
        },
      });

      // If the user exists
      if (user) {
        return res.status(200).json({ message: "Login successful", user });
      } else {
        return res
          .status(204)
          .json({ error: "Invalid credentials or inactive user" });
      }
    } catch (error) {
      console.error("Error querying the database:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
