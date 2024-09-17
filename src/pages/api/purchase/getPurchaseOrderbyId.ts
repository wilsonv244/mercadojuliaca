import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/infraestructure/postgressDB/prisma";
import { PurchaseOrderWithRequest } from "@/domain/models/serverModel/purchase/GetPurchaseOrderModel";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { id_order } = req.query;

    if (!id_order) {
      return res
        .status(400)
        .json({ error: "El identificador de la orden es requerido" });
    }

    try {
      const orderData = await prisma.purchaseOrder.findUnique({
        where: {
          id_order: Number(id_order),
        },
        include: {
          request: true,
          supplier: true,
        },
      });

      if (!orderData) {
        return res
          .status(404)
          .json({ error: "No se encontró la orden de compra con ese ID" });
      }

      const response: PurchaseOrderWithRequest = {
        id_order: orderData.id_order,
        id_request: orderData.id_request,
        id_supplier: orderData.id_supplier,
        order_date: orderData.order_date.toISOString(),
        total_amount: Number(orderData.total_amount),
        purchaseRequest: {
          id_request: orderData.request.id_request,
          item: orderData.request.item,
          description: orderData.request.description,
          quantity: orderData.request.quantity,
          unit_of_measurement: orderData.request.unit_of_measurement,
          planned_cost: Number(orderData.request.planned_cost),
        },
        purchaseSupplier: {
          ruc: orderData.supplier.ruc,
          supplier_name: orderData.supplier.supplier_name,
          legal_name: orderData.supplier.legal_name,
        },
      };

      return res.status(200).json(response);
    } catch (error) {
      console.error("Error al consultar la orden de compra:", error);
      return res
        .status(500)
        .json({ error: "Error interno al consultar la orden de compra" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Método ${req.method} no permitido`);
  }
}
