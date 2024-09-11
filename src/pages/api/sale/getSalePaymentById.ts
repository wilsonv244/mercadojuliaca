import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/infraestructure/postgressDB/prisma"; // Asegúrate de tener configurado correctamente tu Prisma Client

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { id_sale } = req.query;

    // Verificar si el id_sale está presente
    if (!id_sale) {
      return res.status(400).json({ error: "El campo id_sale es requerido" });
    }

    try {
      // Buscar los registros en SalePayment por id_sale
      const salePayments = await prisma.salePayment.findMany({
        where: {
          id_sale: parseInt(id_sale as string, 10), // Convertir el id_sale a entero
        },
      });

      // Si no se encuentra ningún registro
      if (salePayments.length === 0) {
        return res
          .status(404)
          .json({
            error: `No se encontraron pagos para la venta con id_sale: ${id_sale}`,
          });
      }

      // Devolver los registros encontrados
      return res.status(200).json(salePayments);
    } catch (error) {
      console.error("Error al buscar los pagos por id_sale:", error);
      return res.status(500).json({ error: "Error al buscar los pagos" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
