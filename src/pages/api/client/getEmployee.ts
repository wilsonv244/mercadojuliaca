import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/infraestructure/postgressDB/prisma";
import { Employee } from "@/domain/models/clientNavModel/cliente";

// Definimos la interfaz Employee

// Respuesta personalizada con el listado de empleados o un mensaje de error
interface EmployeesResponse {
  employees?: Employee[];
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<EmployeesResponse>
) {
  if (req.method === "GET") {
    try {
      const employees = await prisma.employee.findMany();
      res.status(200).json({ employees });
    } catch (error) {
      console.error("Error fetching employees:", error);
      res.status(500).json({ error: "Error fetching employees" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
