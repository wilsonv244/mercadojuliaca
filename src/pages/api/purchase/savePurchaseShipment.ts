import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, PurchaseShipment } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const {
      id_order,
      shipment_date,
      receipt_type,
      receipt_number,
      payment_type,
      payment_due_date,
      payment_status,
    }: PurchaseShipment = req.body;

    if (
      !id_order ||
      !shipment_date ||
      !receipt_type ||
      !receipt_number ||
      !payment_type ||
      !payment_due_date
    ) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios." });
    }

    try {
      const newShipment = await prisma.purchaseShipment.create({
        data: {
          id_order,
          shipment_date: new Date(shipment_date),
          receipt_type,
          receipt_number,
          payment_type,
          payment_due_date: new Date(payment_due_date),
          payment_status,
        },
      });

      return res.status(200).json({
        message: "Envío registrado correctamente.",
        shipment: newShipment,
      });
    } catch (error) {
      console.error("Error al guardar el envío:", error);
      return res.status(500).json({ error: "Error al guardar el envío." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Método ${req.method} no permitido`);
  }
}
