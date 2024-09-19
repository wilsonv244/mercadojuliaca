import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/infraestructure/postgressDB/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { id_request } = req.body;

  if (!id_request) {
    return res
      .status(400)
      .json({ error: "El ID de la solicitud es requerido" });
  }

  try {
    const updatedRequest = await prisma.purchaseRequest.update({
      where: {
        id_request: Number(id_request),
      },
      data: {
        is_approved: true,
      },
    });

    return res.status(200).json({
      message: "Solicitud aprobada exitosamente",
      data: updatedRequest,
    });
  } catch (error) {
    console.error("Error al actualizar la solicitud:", error);
    return res.status(500).json({ error: "Error al actualizar la solicitud" });
  }
}
