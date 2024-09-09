// /pages/api/vendedor/saveVendedor.js
import prisma from "@/infraestructure/postgressDB/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const {
      document_number,
      first_name,
      last_name,
      phone_number,
      phone_number2,
      canal, // Usado como id_channel
      estatus, // En este caso, se ignora en la tabla Employee, pero puedes agregarlo si es necesario
    } = req.body;

    try {
      const newEmployee = await prisma.employee.create({
        data: {
          id_entity: 1, // Assuming the id_entity is constant
          id_channel: 1,
          document_type: 1, // Assuming document_type is constant
          document_number,
          first_name,
          last_name,
          phone_number,
          phone_number2: phone_number2 || null,
          address: "Default Address", // Puedes cambiar esto si el formulario tiene dirección
          created_at: new Date(),
          updated_at: new Date(),
        },
      });
      res.status(201).json(newEmployee);
    } catch (error) {
      console.error("Error creating employee:", error);
      res.status(500).json({ error: "Error creating employee" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
