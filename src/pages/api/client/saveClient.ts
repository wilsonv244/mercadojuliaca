import prisma from "@/infraestructure/postgressDB/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const {
        id_entity,
        id_channel,
        document_type,
        document_number,
        person_type,
        last_name,
        first_name,
        phone_number,
        phone_number2,
        zone,
        address,
        province,
        district,
      } = req.body;

      // Validar si todos los campos requeridos están presentes
      if (
        !id_entity ||
        !id_channel ||
        !document_type ||
        !document_number ||
        !person_type ||
        !last_name ||
        !first_name ||
        !phone_number ||
        !zone ||
        !address ||
        !province ||
        !district
      ) {
        return res.status(400).json({
          error: "Todos los campos requeridos deben ser completados.",
        });
      }

      // Insertar los datos en la tabla Client
      const newClient = await prisma.client.create({
        data: {
          id_entity,
          id_channel,
          document_type,
          document_number,
          person_type,
          last_name,
          first_name,
          phone_number,
          phone_number2: phone_number2 || null, // Si phone_number2 es opcional
          zone,
          address,
          province,
          district,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      // Enviar la respuesta con los datos insertados
      return res.status(201).json(newClient);
    } catch (error) {
      console.error("Error al insertar cliente:", error);
      return res.status(500).json({ error: "Error al insertar el cliente." });
    }
  } else {
    // Método no permitido
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Método ${req.method} no permitido.`);
  }
}
