import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/infraestructure/postgressDB/prisma"; // Ajusta el path según tu proyecto
import { SalePaymentResponse } from "@/domain/models/serverModel/dataBases/getAllSale";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SalePaymentResponse>
) {
  const { startDate, endDate } = req.query;

  try {
    let whereClause = {};

    // Si se proporcionan fechas, agregamos el filtro a la cláusula WHERE
    if (startDate && endDate) {
      whereClause = {
        receipt_date: {
          gte: new Date(startDate as string),
          lte: new Date(endDate as string),
        },
      };
    }

    // Ejecutamos la consulta con Prisma, aplicando la cláusula where en caso de tener fechas
    const sales = await prisma.sale.findMany({
      where: whereClause,
      include: {
        SalePayments: true, // Incluir los pagos relacionados (SalePayment)
      },
    });

    // Devolver los datos obtenidos
    res.status(200).json({ salePayments: sales });
  } catch (error) {
    console.error("Error al obtener las ventas y pagos:", error);
    res.status(500).json({ error: "Error al obtener las ventas y pagos" });
  }
}
