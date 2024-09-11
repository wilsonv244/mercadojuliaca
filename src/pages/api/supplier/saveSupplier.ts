// /pages/api/supplier/saveSupplier.ts

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/infraestructure/postgressDB/prisma"; // Asegúrate de tener Prisma configurado

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const {
      id_entity,
      ruc,
      supplier_name,
      legal_name,
      phone_number,
      phone_number2,
    } = req.body;

    try {
      const newSupplier = await prisma.supplier.create({
        data: {
          id_entity,
          ruc,
          supplier_name,
          legal_name,
          phone_number,
          phone_number2,
        },
      });

      return res.status(201).json(newSupplier);
    } catch (error) {
      console.error("Error al crear el proveedor:", error);
      return res.status(500).json({ error: "Error al crear el proveedor" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
