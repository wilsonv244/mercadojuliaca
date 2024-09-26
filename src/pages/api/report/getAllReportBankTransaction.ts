import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/infraestructure/postgressDB/prisma"; // Ajusta la ruta a tu archivo de configuración Prisma

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { d_fecha_inicio, d_fecha_fin } = req.query;
    try {
      let result = "";
      if (d_fecha_inicio == "null " || d_fecha_fin == "null") {
        console.log("Sin rango de fechas");
        result = await prisma.$queryRaw`
          SELECT 
    a.id_transaction AS codigo_transaccion,
    a.transaction_date AS fecha_transaccion,
    'GERENTE GENERAL' AS usuario_que_envia,
    b.profile AS usuario_que_recepciona,
    a.receipt_type AS tipo_recibo,
    a.receipt_number AS numero_recibo,
    a.total_amount AS monto_total
FROM 
    Bank_transaction a
LEFT JOIN 
    profiles b ON a.id_user_receive = b.id_profile
;
        `;
      } else {
        console.log("Con rango de fechas");
        result = await prisma.$queryRaw`
SELECT 
    a.id_transaction AS codigo_transaccion,
    a.transaction_date AS fecha_transaccion,
    'GERENTE GENERAL' AS usuario_que_envia,
    b.profile AS usuario_que_recepciona,
    a.receipt_type AS tipo_recibo,
    a.receipt_number AS numero_recibo,
    a.total_amount AS monto_total
FROM 
    Bank_transaction a
LEFT JOIN 
    profiles b ON a.id_user_receive = b.id_profile

       WHERE 	a.transaction_date between ${new Date(
         d_fecha_inicio as string
       ).toISOString()}::timestamp and ${new Date(
          d_fecha_fin as string
        ).toISOString()}::timestamp;
        `;
      }

      res.status(200).json(result);
    } catch (error) {
      console.error("Request error", error);
      res.status(500).json({ error: "Error al ejecutar la consulta" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
