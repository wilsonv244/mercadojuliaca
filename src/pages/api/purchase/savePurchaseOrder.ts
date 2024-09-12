import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/infraestructure/postgressDB/prisma"; // Asegúrate de configurar Prisma en tu proyecto
import {
  PurchaseOrderRequest,
  PurchaseOrderResponse,
} from "@/domain/models/serverModel/purchase/savePurchaseOrderModel";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PurchaseOrderResponse>
) {
  if (req.method === "POST") {
    const {
      id_request,
      id_supplier,
      order_date,
      total_amount,
    }: PurchaseOrderRequest = req.body;

    // Validación básica
    if (!id_request || !id_supplier || !order_date || !total_amount) {
      return res.status(400).json({
        success: false,
        message: "Todos los campos son obligatorios",
      });
    }

    try {
      const newPurchaseOrder = await prisma.purchaseOrder.create({
        data: {
          id_request: Number(id_request),
          id_supplier: Number(id_supplier),
          order_date: new Date(order_date),
          total_amount,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Orden de compra registrada exitosamente",
        purchaseOrder: newPurchaseOrder,
      });
    } catch (error) {
      console.error("Error al guardar la orden de compra:", error);
      return res.status(500).json({
        success: false,
        message: "Error al registrar la orden de compra",
      });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({
      success: false,
      message: `Método ${req.method} no permitido`,
    });
  }
}
