import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/infraestructure/postgressDB/prisma";
import { PurchaseOrderResponseServer } from "@/domain/models/serverModel/purchase/getAllPurchaseOrder";

// Definir el tipo de respuesta
interface PurchaseOrderResponse {
  purchaseOrders?: PurchaseOrderResponseServer[];
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PurchaseOrderResponse>
) {
  // Asegurarse de que solo se permite el método GET
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    // Consulta a la base de datos utilizando Prisma
    const purchaseOrders = await prisma.purchaseOrder.findMany({
      select: {
        id_order: true,
        order_date: true,
        id_request: true,
        total_amount: true,
        request: {
          select: {
            item: true,
            description: true,
            quantity: true,
            unit_of_measurement: true,
            planned_cost: true,
          },
        },
        supplier: {
          select: {
            legal_name: true,
          },
        },
      },
    });

    // Devolver los resultados en formato JSON
    res.status(200).json({ purchaseOrders });
  } catch (error) {
    console.error("Error fetching purchase orders:", error);
    res.status(500).json({ error: "Error fetching purchase orders" });
  }
}
