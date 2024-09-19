import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/infraestructure/postgressDB/prisma"; // Asegúrate de tener esta configuración lista para tu Prisma client
import { PurchaseRequest } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const {
        is_approved,
        id_cost_center,
        request_date,
        item,
        description,
        quantity,
        unit_of_measurement,
        planned_cost,
      } = req.body;

      if (
        !id_cost_center ||
        !request_date ||
        !item ||
        !description ||
        !quantity ||
        !unit_of_measurement ||
        !planned_cost
      ) {
        return res
          .status(400)
          .json({ error: "Todos los campos son requeridos." });
      }

      const newPurchaseRequest: PurchaseRequest =
        await prisma.purchaseRequest.create({
          data: {
            is_approved: Number(is_approved) > 100 ? false : true,
            id_cost_center: Number(id_cost_center),
            request_date: new Date(request_date), // Convertir a tipo `Date` si es necesario
            item,
            description,
            quantity,
            unit_of_measurement,
            planned_cost,
          },
        });

      return res.status(201).json(newPurchaseRequest);
    } catch (error) {
      console.error("Error al guardar la solicitud de compra:", error);
      return res
        .status(500)
        .json({ error: "Error al guardar la solicitud de compra." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Método ${req.method} no permitido`);
  }
}
