// pages/api/purchase/getApprovedPurchaseRequests.ts

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/infraestructure/postgressDB/prisma";
import { ApiResponse } from "@/domain/models/serverModel/purchase/responseGetPurchaseReq";
import { PurchaseRequest } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    const approvedRequests: PurchaseRequest[] =
      await prisma.purchaseRequest.findMany({
        where: {
          is_approved: false,
          
        },
      });

    if (approvedRequests.length === 0) {
      return res.status(204).json({
        status_code: 204,
        message: "No se encontraron solicitudes aprobadas.",
      });
    }

    return res.status(200).json({
      status_code: 200,
      data: approvedRequests,
    });
  } catch (error) {
    console.error("Error al consultar las solicitudes aprobadas:", error);
    return res.status(500).json({
      status_code: 500,
      message: "Error interno del servidor.",
    });
  }
}
