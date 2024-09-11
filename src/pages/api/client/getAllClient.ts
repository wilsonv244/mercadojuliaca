// /pages/api/client/getClients.ts

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/infraestructure/postgressDB/prisma";
import {
  ClientEntity,
  ClientResponse,
} from "@/domain/models/serverModel/client/responseGetClientModel";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ClientResponse | { error: string }>
) {
  if (req.method === "GET") {
    try {
      const clients: ClientEntity[] = await prisma.client.findMany({
        select: {
          id_client: true,
          document_number: true,
          last_name: true,
          first_name: true,
          phone_number: true,
          phone_number2: true,
          address: true,
          zone: true,
          province: true,
          district: true,
        },
      });
      if (clients.length == 0) {
        return res
          .status(204)
          .json({ error: "No hay registros de los clientes" });
      }

      return res.status(200).json({ clients });
    } catch (error) {
      console.error("Error al obtener los clientes:", error);
      return res.status(500).json({ error: "Error al obtener los clientes" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
