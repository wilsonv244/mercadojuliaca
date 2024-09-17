import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/infraestructure/postgressDB/prisma";
import { ShipmentPayment } from "@prisma/client";
import ShipmentPaymentResponse from "@/domain/models/serverModel/shipment/getShipmentById";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ShipmentPaymentResponse[] | { error: string }>
) {
  const { id_shipment, receipt_number } = req.query;

  if (!id_shipment && !receipt_number) {
    return res.status(400).json({
      error: "Debe proporcionar el ID del envío o el número de recibo",
    });
  }

  try {
    let shipmentPaymentData: ShipmentPaymentResponse[] = [];

    // Búsqueda por `id_shipment`
    if (id_shipment) {
      shipmentPaymentData = await prisma.shipmentPayment.findMany({
        where: {
          id_shipment: Number(id_shipment),
        },
        include: {
          shipment: {
            include: {
              order: {
                include: {
                  supplier: true,
                },
              },
            },
          },
        },
      });
    }
    // Búsqueda por `receipt_number` dentro de `PurchaseShipment`
    else if (receipt_number) {
      shipmentPaymentData = await prisma.shipmentPayment.findMany({
        where: {
          shipment: {
            receipt_number: String(receipt_number), // Búsqueda correcta en `PurchaseShipment`
          },
        },
        include: {
          shipment: {
            include: {
              order: {
                include: {
                  supplier: true,
                },
              },
            },
          },
        },
      });
    }

    // Verificar si no se encontraron datos
    if (shipmentPaymentData.length === 0) {
      return res.status(404).json({
        error: "No se encontraron datos para los parámetros proporcionados",
      });
    }

    const shipmentPaymentResponse = shipmentPaymentData.map((payment) => ({
      ...payment,
      payment_amount: payment.payment_amount,
      shipment: {
        ...payment.shipment,
        order: {
          ...payment.shipment.order,
          total_amount: payment.shipment.order.total_amount,
        },
      },
    }));
    res.status(200).json(shipmentPaymentResponse);
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    res.status(500).json({ error: "Error al obtener los datos" });
  }
}
