// src/pages/api/users.ts
import prisma from "@/infraestructure/postgressDB/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const Entity = await prisma.entity.findMany();
  res.status(200).json(Entity);
}
