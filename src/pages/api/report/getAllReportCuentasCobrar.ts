// pages/api/purchase-details/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/infraestructure/postgressDB/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { d_fecha_inicio, d_fecha_fin } = req.query;
  if (req.method === "GET") {
    try {
      let result = "";
      if (d_fecha_inicio == "null " || d_fecha_fin == "null") {
        result = await prisma.$queryRaw`
          SELECT 
      s.id_sale AS nro_venta,
      s.receipt_date AS fecha_venta,
      s.receipt_type AS tipo_comprobante_venta,
      s.receipt_number AS nro_comprobante_venta,    
      s.total_amount AS monto_total_venta,
      
      -- Estado de la venta
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
  
      -- Tipo de pago (pago de cuota o nota de crédito)
      CASE
          WHEN sp.is_credit_note = TRUE 
              THEN 'NOTA DE CRÉDITO'
              ELSE 'PAGO DE CUOTA'
      END AS tipo_pago,
  
      -- Monto del pago (positivo para pagos, negativo para notas de crédito)
      CASE
          WHEN sp.is_credit_note = TRUE 
              THEN -sp.payment_amount
              ELSE sp.payment_amount
      END AS monto_pago,
  
      -- Descripción del pago
      sp.description AS descript_pago,
  
      -- Número de recibo del pago
      CASE
          WHEN sp.payment_receipt_number = '' 
              THEN s.receipt_number
              ELSE sp.payment_receipt_number
      END AS recibo_nro_pago,
  
      -- Fecha de pago
      sp.payment_registration_date AS fecha_pago
  FROM 
      public."Sale" s
  JOIN 
      public."Client" c ON s.id_client = c.id_client
  JOIN 
      public."Employee" e ON s.id_employee = e.id_employee
  JOIN 
      public."Channel" ch ON e.id_channel = ch.id_channel
  JOIN 
      public."SalePayment" sp ON s.id_sale = sp.id_sale;
        `;
      } else {
        result = await prisma.$queryRaw`
          SELECT 
      s.id_sale AS nro_venta,
      s.receipt_date AS fecha_venta,
      s.receipt_type AS tipo_comprobante_venta,
      s.receipt_number AS nro_comprobante_venta,    
      s.total_amount AS monto_total_venta,
      
      -- Estado de la venta
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
  
      -- Tipo de pago (pago de cuota o nota de crédito)
      CASE
          WHEN sp.is_credit_note = TRUE 
              THEN 'NOTA DE CRÉDITO'
              ELSE 'PAGO DE CUOTA'
      END AS tipo_pago,
  
      -- Monto del pago (positivo para pagos, negativo para notas de crédito)
      CASE
          WHEN sp.is_credit_note = TRUE 
              THEN -sp.payment_amount
              ELSE sp.payment_amount
      END AS monto_pago,
  
      -- Descripción del pago
      sp.description AS descript_pago,
  
      -- Número de recibo del pago
      CASE
          WHEN sp.payment_receipt_number = '' 
              THEN s.receipt_number
              ELSE sp.payment_receipt_number
      END AS recibo_nro_pago,
  
      -- Fecha de pago
      sp.payment_registration_date AS fecha_pago
  FROM 
      public."Sale" s
  JOIN 
      public."Client" c ON s.id_client = c.id_client
  JOIN 
      public."Employee" e ON s.id_employee = e.id_employee
  JOIN 
      public."Channel" ch ON e.id_channel = ch.id_channel
  JOIN 
      public."SalePayment" sp ON s.id_sale = sp.id_sale
       where s.receipt_date between ${new Date(d_fecha_inicio as string).toISOString()}::timestamp and ${new Date(d_fecha_fin as string).toISOString()}::timestamp;
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
