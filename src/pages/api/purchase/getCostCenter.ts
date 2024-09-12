import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/infraestructure/postgressDB/prisma"; // Asegúrate de tener esta configuración lista para tu Prisma client
import { CostCenter } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const costCenters: CostCenter[] = await prisma.costCenter.findMany();

      if (costCenters.length === 0) {
        return res
          .status(204)
          .json({ message: "No se encontraron centros de costo" });
      }

      return res.status(200).json(costCenters);
    } catch (error) {
      console.error("Error al obtener los centros de costo:", error);
      return res
        .status(500)
        .json({ error: "Error al obtener los datos de los centros de costo" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Método ${req.method} no permitido`);
  }
}
