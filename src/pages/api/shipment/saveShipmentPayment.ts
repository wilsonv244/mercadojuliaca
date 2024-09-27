import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/infraestructure/postgressDB/prisma";
import { ShipmentPaymentData } from "@/domain/models/serverModel/shipment/saveShipmentPaymentModel";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const {
      description,
      id_shipment,
      is_credit_note,
      payment_date,
      payment_amount,
      payment_receipt_number,
      operation_number,
      id_bank,
      id_receipt_type,
    }: ShipmentPaymentData = req.body;

    if (!id_shipment || !payment_date) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    try {
      const newPayment = await prisma.shipmentPayment.create({
        data: {
          id_bank: id_bank,
          operation_number: operation_number,
          id_receipt_type: id_receipt_type,
          description,
          is_credit_note,
          id_shipment,
          payment_date: new Date(payment_date),
          payment_amount: payment_amount,
          payment_receipt_number: is_credit_note ? payment_receipt_number : "",
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
