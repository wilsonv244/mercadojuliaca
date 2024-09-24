import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/infraestructure/postgressDB/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const purchaseRequests = await prisma.purchaseRequest.findMany({
      include: {
        cost_center: {
          select: {
            cost_center_name: true,
          },
        },
      },
    });

    res.status(200).json(purchaseRequests);
  } catch (error) {
    console.error("Error fetching purchase requests:", error);
    res.status(500).json({ error: "Error fetching data" });
  }
}
