import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/infraestructure/postgressDB/prisma";
import { ShipmentPaymentData } from "@/domain/models/serverModel/shipment/saveShipmentPaymentModel";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { id_shipment, payment_date, payment_amount }: ShipmentPaymentData =
      req.body;

    
    if (!id_shipment || !payment_date || !payment_amount) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    try {
      const newPayment = await prisma.shipmentPayment.create({
        data: {
          id_shipment,
          payment_date: new Date(payment_date),
          payment_amount,
        },
      });

      return res.status(201).json({
        message: "Pago de envío registrado correctamente",
        data: newPayment,
      });
    } catch (error) {
      console.error("Error al registrar el pago de envío:", error);
      return res
        .status(500)
        .json({ error: "Error al registrar el pago de envío" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Método ${req.method} no permitido` });
  }
}
