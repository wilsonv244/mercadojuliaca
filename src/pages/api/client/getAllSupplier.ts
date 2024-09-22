import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/infraestructure/postgressDB/prisma";
import { SuppliersResponse } from "@/domain/models/serverModel/client/responseGetSupplier";

// Definimos la interfaz Supplier para tipar la respuesta

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuppliersResponse>
) {
  if (req.method === "GET") {
    try {
      const suppliers = await prisma.supplier.findMany({
        include: {
          entity: true, // Asume que también quieres incluir detalles de la entidad relacionada
          PurchaseOrders: true, // Asume que quieres incluir las órdenes de compra asociadas
        },
      });
      res.status(200).json({ suppliers });
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      res.status(500).json({ error: "Error fetching suppliers" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
