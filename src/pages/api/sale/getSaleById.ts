import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/infraestructure/postgressDB/prisma"; // Asegúrate de que Prisma esté correctamente configurado

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { receipt_number } = req.query;

    // Verificar si receipt_number está presente
    if (!receipt_number) {
      return res
        .status(400)
        .json({ error: "El número de recibo es requerido" });
    }

    try {
      // Buscar el registro en Sale por receipt_number
      const sale = await prisma.sale.findUnique({
        where: {
          receipt_number: receipt_number as string, // Asegurarse de que es un string
        },
      });

      // Si no se encuentra la venta
      if (!sale) {
        return res
          .status(404)
          .json({
            error: `No se encontró la venta con el número de recibo: ${receipt_number}`,
          });
      }

      // Devolver la venta encontrada
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
