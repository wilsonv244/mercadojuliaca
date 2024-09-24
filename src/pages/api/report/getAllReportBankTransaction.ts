import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/infraestructure/postgressDB/prisma"; // Ajusta la ruta a tu archivo de configuración Prisma

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { d_fecha_inicio, d_fecha_fin } = req.query;

    try {
      let transactions;

      if (d_fecha_inicio == "null " || d_fecha_fin == "null") {
        transactions = await prisma.bankTransaction.findMany();
      } else {
        transactions = await prisma.bankTransaction.findMany({
          where: {
            transaction_date: {
              gte: new Date(d_fecha_inicio as string), // Fecha de inicio
              lte: new Date(d_fecha_fin as string), // Fecha de fin
            },
          },
        });
      }

      res.status(200).json(transactions);
    } catch (error) {
      console.error("Error ejecutando la consulta:", error);
      res.status(500).json({ error: "Error al ejecutar la consulta." });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
