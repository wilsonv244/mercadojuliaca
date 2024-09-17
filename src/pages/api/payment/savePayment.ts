import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/infraestructure/postgressDB/prisma"; // Asegúrate de que tu cliente Prisma esté bien configurado.

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const {
      id_sale,
      id_employee,
      description,
      payment_amount,
      is_credit_note,
    } = req.body;
    if (!id_sale || !id_employee || !payment_amount) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    try {
      const newSalePayment = await prisma.salePayment.create({
        data: {
          is_credit_note,
          id_sale: parseInt(id_sale),
          id_employee: parseInt(id_employee),
          payment_registration_date: new Date(), // Se registra la fecha actual
          description: description || "",
          payment_amount: parseFloat(payment_amount),
        },
      });

      return res.status(201).json(newSalePayment);
    } catch (error) {
      console.error("Error al crear el pago:", error);
      return res.status(500).json({ error: "Error al registrar el pago" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Método ${req.method} no permitido`);
  }
}
