// pages/api/purchaseRequest/getPurchaseRequestById.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/infraestructure/postgressDB/prisma";
import { PurchaseRequest } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { id_request } = req.query;

    if (!id_request) {
      return res
        .status(400)
        .json({ error: "El ID de la solicitud de compra es requerido" });
    }

    try {
      const purchaseRequest: PurchaseRequest | null =
        await prisma.purchaseRequest.findUnique({
          where: {
            id_request: Number(id_request),
          },
        });

      if (!purchaseRequest) {
        return res
          .status(404)
          .json({ error: "No se encontró la solicitud de compra con ese ID" });
      }

      return res.status(200).json(purchaseRequest);
    } catch (error) {
      console.error("Error al obtener la solicitud de compra:", error);
      return res
        .status(500)
        .json({ error: "Error al obtener la solicitud de compra" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Método ${req.method} no permitido`);
  }
}
