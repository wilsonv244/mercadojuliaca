import prisma from "@/infraestructure/postgressDB/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const {
      transaction_date,
      id_user_delivery,
      id_user_receive,
      receipt_type,
      receipt_number,
      total_amount,
    } = req.body;
    console.log("req.body");
    console.log(req.body);
    try {
      if (
        !transaction_date ||
        !id_user_delivery ||
        !id_user_receive ||
        !receipt_type ||
        !receipt_number ||
        !total_amount
      ) {
        return res
          .status(400)
          .json({ error: "Faltan parámetros en la solicitud" });
      }

      const newTransaction = await prisma.bankTransaction.create({
        data: {
          transaction_date: new Date(transaction_date),
          id_user_delivery,
          id_user_receive,
          receipt_type,
          receipt_number,
          total_amount,
        },
      });

      res.status(201).json(newTransaction);
    } catch (error) {
      console.error("Request error", error);
      res.status(500).json({ error: "Error al registrar la transacción" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
