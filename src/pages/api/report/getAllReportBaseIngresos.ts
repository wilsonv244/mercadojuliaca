// pages/api/purchase-details/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/infraestructure/postgressDB/prisma";
import { isDate } from "date-fns";
import { isString } from "formik";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { d_fecha_inicio, d_fecha_fin } = req.query;
    try {
      console.log("triste");
      console.log(typeof d_fecha_inicio);
      console.log(d_fecha_inicio);
      let result = "";
      if (d_fecha_inicio == "null " || d_fecha_fin == "null") {
        console.log("Sin rango de fechas");
        result = await prisma.$queryRaw`
          SELECT 
      s.id_sale AS nro_venta,
      s.receipt_date AS fecha_venta,
      s.receipt_type AS tipo_comprobante_venta,
      s.receipt_number AS nro_comprobante_venta,    
      s.total_amount AS monto_total_venta,
      CASE 
          WHEN s.status = TRUE 
              THEN 'Pagado'
              ELSE 'Pendiente'
      END AS estado_venta,
      
      -- Información del cliente
      c.document_type AS tipo_doc_cliente,
      c.document_number AS nro_doc_cliente,
      c.zone AS zona, 
      CONCAT(c.first_name, ' ', c.last_name) AS nombre_cliente,
      
      -- Información del vendedor
      e.document_number AS nro_doc_vendedor,
      CONCAT(e.first_name, ' ', e.last_name) AS nombre_vendedor,
      ch.channel_name AS canal_vendedor,	
  
      -- Abono total (sin incluir notas de crédito)
      (SELECT 
          COALESCE(SUM(sp.payment_amount), 0) 
       FROM public."SalePayment" sp 
       WHERE sp.id_sale = s.id_sale
         AND sp.is_credit_note = false) AS abono_total,
  
      -- Nota de crédito total
      (SELECT 
          COALESCE(SUM(sp.payment_amount), 0) 
       FROM public."SalePayment" sp 
       WHERE sp.id_sale = s.id_sale
         AND sp.is_credit_note = true) * -1 AS nota_credito_total,
  
      -- Saldo total
      (s.total_amount - 
          (SELECT 
              COALESCE(SUM(sp.payment_amount), 0)  
           FROM public."SalePayment" sp 
           WHERE sp.id_sale = s.id_sale 
             AND sp.is_credit_note = false)) AS saldo_total
  FROM 
      public."Sale" s
  JOIN 
      public."Client" c ON s.id_client = c.id_client
  JOIN 
      public."Employee" e ON s.id_employee = e.id_employee
  JOIN 
      public."Channel" ch ON e.id_channel = ch.id_channel;
        `;
      } else {
        console.log("Con rango de fechas");
        result = await prisma.$queryRaw`
          SELECT 
      s.id_sale AS nro_venta,
      s.receipt_date AS fecha_venta,
      s.receipt_type AS tipo_comprobante_venta,
      s.receipt_number AS nro_comprobante_venta,    
      s.total_amount AS monto_total_venta,
      CASE 
          WHEN s.status = TRUE 
              THEN 'Pagado'
              ELSE 'Pendiente'
      END AS estado_venta,
      
      -- Información del cliente
      c.document_type AS tipo_doc_cliente,
      c.document_number AS nro_doc_cliente,
      c.zone AS zona, 
      CONCAT(c.first_name, ' ', c.last_name) AS nombre_cliente,
      
      -- Información del vendedor
      e.document_number AS nro_doc_vendedor,
      CONCAT(e.first_name, ' ', e.last_name) AS nombre_vendedor,
      ch.channel_name AS canal_vendedor,	
  
      -- Abono total (sin incluir notas de crédito)
      (SELECT 
          COALESCE(SUM(sp.payment_amount), 0) 
       FROM public."SalePayment" sp 
       WHERE sp.id_sale = s.id_sale
         AND sp.is_credit_note = false) AS abono_total,
  
      -- Nota de crédito total
      (SELECT 
          COALESCE(SUM(sp.payment_amount), 0) 
       FROM public."SalePayment" sp 
       WHERE sp.id_sale = s.id_sale
         AND sp.is_credit_note = true) * -1 AS nota_credito_total,
  
      -- Saldo total
      (s.total_amount - 
          (SELECT 
              COALESCE(SUM(sp.payment_amount), 0)  
           FROM public."SalePayment" sp 
           WHERE sp.id_sale = s.id_sale 
             AND sp.is_credit_note = false)) AS saldo_total
  FROM 
      public."Sale" s
  JOIN 
      public."Client" c ON s.id_client = c.id_client
  JOIN 
      public."Employee" e ON s.id_employee = e.id_employee
  JOIN 
      public."Channel" ch ON e.id_channel = ch.id_channel
       where s.receipt_date between ${new Date(
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
