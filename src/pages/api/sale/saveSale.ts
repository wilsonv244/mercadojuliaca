import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/infraestructure/postgressDB/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const {
      id_employee,
      id_client,
      receipt_type,
      receipt_number,
      total_amount,
      status,
    } = req.body;

    try {
      const newSale = await prisma.sale.create({
        data: {
          id_employee,
          id_client,
          receipt_type,
          receipt_number,
          receipt_date: new Date(), // Puedes ajustarlo si es necesario
          total_amount,
          status,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });
      res.status(201).json(newSale);
    } catch (error) {
      console.error("Error creating sale:", error);
      res.status(500).json({ error: "Error creating sale" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
