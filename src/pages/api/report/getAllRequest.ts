import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/infraestructure/postgressDB/prisma";
import { PurchaseRequestResponse } from "@/domain/models/serverModel/dataBases/getAllRequest";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PurchaseRequestResponse>
) {
  const { startDate, endDate } = req.query;

  try {
    let purchaseRequests;

    if (startDate && endDate) {
      purchaseRequests = await prisma.purchaseRequest.findMany({
        where: {
          request_date: {
            gte: new Date(startDate as string),
            lte: new Date(endDate as string),
          },
        },
        include: {
          PurchaseOrders: {
            include: {
              PurchaseShipments: {
                include: {
                  ShipmentPayments: true,
                },
              },
            },
          },
        },
      });
    } else {
      purchaseRequests = await prisma.purchaseRequest.findMany({
        include: {
          PurchaseOrders: {
            include: {
              PurchaseShipments: {
                include: {
                  ShipmentPayments: true,
                },
              },
            },
          },
        },
      });
    }

    if (purchaseRequests.length === 0) {
      return res.status(404).json({
        error: "No se encontraron datos para los parámetros proporcionados",
      });
    }

    res.status(200).json({ purchaseRequests });
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    res.status(500).json({ error: "Error al obtener los datos" });
  }
}
