// pages/api/sale/getSaleByReceiptNumber.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/infraestructure/postgressDB/prisma";
import { SaleEntity } from "@/domain/models/serverModel/client/responseGetSaleModel";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { receipt_number } = req.query;

    if (!receipt_number) {
      return res
        .status(400)
        .json({ error: "El número de recibo es requerido" });
    }

    try {
      const saleData: SaleEntity[] = await prisma.sale.findMany({
        where: {
          receipt_number: receipt_number as string,
        },
        select: {
          id_sale: true,
          id_employee: true,
          id_client: true,
          total_amount: true,
          receipt_date: true,
          SalePayments: {
            select: {
              payment_amount: true,
              description: true,
              payment_registration_date: true,
            },
          },
        },
      });

      if (saleData.length === 0) {
        return res.status(204).json([]);
      }

      return res.status(200).json(saleData);
    } catch (error) {
      console.error("Error al obtener datos:", error);
      return res
        .status(500)
        .json({ error: "Error al obtener los datos de la venta" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Método ${req.method} no permitido`);
  }
}
