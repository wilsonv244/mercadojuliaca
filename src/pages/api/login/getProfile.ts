import prisma from "@/infraestructure/postgressDB/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const users = await prisma.profile.findMany();

      res.status(200).json(users);
    } catch (error) {
      console.error("Request error", error);
      res.status(500).json({ error: "Error al obtener los usuarios" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
