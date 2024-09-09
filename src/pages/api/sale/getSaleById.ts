import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/infraestructure/postgressDB/prisma";  // Asegúrate de tener esta configuración lista para tu prisma client

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { receipt_number } = req.query;

    if (!receipt_number) {
      return res.status(400).json({ error: "El número de recibo es requerido" });
    }

    try {
      const sale = await prisma.sale.findUnique({
        where: {
          receipt_number: receipt_number as string, // Prisma busca por receipt_number
        },
      });

      if (!sale) {
        return res.status(204).json({ error: "No se encontró la venta con ese número de recibo" });
      }

      return res.status(200).json(sale);
    } catch (error) {
      console.error("Error al buscar por número de recibo:", error);
      return res.status(500).json({ error: "Error al buscar la venta" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
