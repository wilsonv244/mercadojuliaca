import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/infraestructure/postgressDB/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { d_fecha_inicio, d_fecha_fin } = req.query;
    try {
      let result: [] = [];
      if (d_fecha_inicio === "null" || d_fecha_fin === "null") {
        result = await prisma.$queryRaw`
          SELECT 
    s.id_sale as nro_venta,
	to_char(s.receipt_date, 'DD-MM-YYYY HH24:MI:SS') as fecha_venta,
    s.receipt_type as tipo_comprobante_venta,
    s.receipt_number as nro_comprobante_venta,    
    s.total_amount as monto_total_venta,
    CASE 
        WHEN s.status = TRUE 
        	THEN 'Pagado'
        	ELSE 'Pendiente'
    END AS estado_venta,
    c.document_type AS tipo_doc_cliente,
    c.document_number AS nro_doc_cliente,
    c.zone as zona, 
    concat(c.first_name,', ',c.last_name) AS nombre_cliente,     
	e.document_number AS nro_doc_vendedor,
	concat(e.first_name,', ',e.last_name) AS nombre_vendedor,
	ch.channel_name as canal_vendedor,	
	(SELECT 
    	COALESCE(SUM(sp.payment_amount), 0) 
    	FROM public."SalePayment" sp 
    	WHERE sp.id_sale = s.id_sale
    		and sp.is_credit_note = false) AS abono_total,
    -(SELECT 
    	COALESCE(SUM(sp.payment_amount), 0) 
    	FROM public."SalePayment" sp 
    	WHERE sp.id_sale = s.id_sale
    		and sp.is_credit_note = true) AS nota_credito_total,
    (s.total_amount - (SELECT COALESCE(SUM(sp.payment_amount), 0)  
                        FROM public."SalePayment" sp 
                        WHERE sp.id_sale = s.id_sale and sp.is_credit_note = false)) AS saldo_total,
	CASE
        WHEN (SELECT COALESCE(SUM(sp.payment_amount), 0)  
                        FROM public."SalePayment" sp
                        WHERE sp.id_sale = s.id_sale and sp.is_credit_note = true) > 0
                THEN (s.total_amount - (SELECT COALESCE(SUM(sp.payment_amount), 0)  
                        FROM public."SalePayment" sp
                        WHERE sp.id_sale = s.id_sale and sp.is_credit_note = true))
                ELSE 0
   END AS monto_total_desc_nota_cred,
   CASE
        WHEN (s.total_amount - (SELECT COALESCE(SUM(sp.payment_amount), 0)  
                        FROM public."SalePayment" sp
                        WHERE sp.id_sale = s.id_sale and sp.is_credit_note = false)) = 0
                THEN 'Pagado'
                ELSE 'Pendiente'
    END AS estado_final_pago,    
    CASE
        WHEN (s.total_amount - (SELECT COALESCE(SUM(sp.payment_amount), 0)  
                        FROM public."SalePayment" sp
                        WHERE sp.id_sale = s.id_sale and sp.is_credit_note = false)) = 0
                THEN 0
                ELSE EXTRACT(DAY FROM CURRENT_DATE - s.receipt_date)
    END as dias_atrazo,
    (SELECT
            COALESCE(COUNT(sp.*), 0)
            FROM public."SalePayment" sp
            WHERE sp.id_sale = s.id_sale
                    and sp.is_credit_note = false) as nro_cuotas,
    CASE
        WHEN (s.total_amount - (SELECT COALESCE(SUM(sp.payment_amount), 0)  
                        FROM public."SalePayment" sp
                        WHERE sp.id_sale = s.id_sale and sp.is_credit_note = false)) = 0
                THEN 'No tienes facturas por cobrar'
                ELSE 'Factura pendiente por cobrar'
    END AS notificacion

	
FROM 
   public."Sale"  s
JOIN 
   public."Client"  c ON s.id_client = c.id_client
JOIN 
   public."Employee"  e ON s.id_employee = e.id_employee
join 
	public."Channel" ch on e.id_channel = ch.id_channel;
        `;
      } else {
        console.log("Con rango de fechas");
        result = await prisma.$queryRaw`
          SELECT 
    s.id_sale as nro_venta,
	to_char(s.receipt_date, 'DD-MM-YYYY HH24:MI:SS') as fecha_venta,
    s.receipt_type as tipo_comprobante_venta,
    s.receipt_number as nro_comprobante_venta,    
    s.total_amount as monto_total_venta,
    CASE 
        WHEN s.status = TRUE 
        	THEN 'Pagado'
        	ELSE 'Pendiente'
    END AS estado_venta,
    c.document_type AS tipo_doc_cliente,
    c.document_number AS nro_doc_cliente,
    c.zone as zona, 
    concat(c.first_name,', ',c.last_name) AS nombre_cliente,     
	e.document_number AS nro_doc_vendedor,
	concat(e.first_name,', ',e.last_name) AS nombre_vendedor,
	ch.channel_name as canal_vendedor,	
	(SELECT 
    	COALESCE(SUM(sp.payment_amount), 0) 
    	FROM public."SalePayment" sp 
    	WHERE sp.id_sale = s.id_sale
    		and sp.is_credit_note = false) AS abono_total,
    -(SELECT 
    	COALESCE(SUM(sp.payment_amount), 0) 
    	FROM public."SalePayment" sp 
    	WHERE sp.id_sale = s.id_sale
    		and sp.is_credit_note = true) AS nota_credito_total,
    (s.total_amount - (SELECT COALESCE(SUM(sp.payment_amount), 0)  
                        FROM public."SalePayment" sp 
                        WHERE sp.id_sale = s.id_sale and sp.is_credit_note = false)) AS saldo_total,
	CASE
        WHEN (SELECT COALESCE(SUM(sp.payment_amount), 0)  
                        FROM public."SalePayment" sp
                        WHERE sp.id_sale = s.id_sale and sp.is_credit_note = true) > 0
                THEN (s.total_amount - (SELECT COALESCE(SUM(sp.payment_amount), 0)  
                        FROM public."SalePayment" sp
                        WHERE sp.id_sale = s.id_sale and sp.is_credit_note = true))
                ELSE 0
   END AS monto_total_desc_nota_cred,
   CASE
        WHEN (s.total_amount - (SELECT COALESCE(SUM(sp.payment_amount), 0)  
                        FROM public."SalePayment" sp
                        WHERE sp.id_sale = s.id_sale and sp.is_credit_note = false)) = 0
                THEN 'Pagado'
                ELSE 'Pendiente'
    END AS estado_final_pago,    
    CASE
        WHEN (s.total_amount - (SELECT COALESCE(SUM(sp.payment_amount), 0)  
                        FROM public."SalePayment" sp
                        WHERE sp.id_sale = s.id_sale and sp.is_credit_note = false)) = 0
                THEN 0
                ELSE EXTRACT(DAY FROM CURRENT_DATE - s.receipt_date)
    END as dias_atrazo,
    (SELECT
            COALESCE(COUNT(sp.*), 0)
            FROM public."SalePayment" sp
            WHERE sp.id_sale = s.id_sale
                    and sp.is_credit_note = false) as nro_cuotas,
    CASE
        WHEN (s.total_amount - (SELECT COALESCE(SUM(sp.payment_amount), 0)  
                        FROM public."SalePayment" sp
                        WHERE sp.id_sale = s.id_sale and sp.is_credit_note = false)) = 0
                THEN 'No tienes facturas por cobrar'
                ELSE 'Factura pendiente por cobrar'
    END AS notificacion

	
FROM 
   public."Sale"  s
JOIN 
   public."Client"  c ON s.id_client = c.id_client
JOIN 
   public."Employee"  e ON s.id_employee = e.id_employee
join 
	public."Channel" ch on e.id_channel = ch.id_channel
          WHERE s.receipt_date BETWEEN ${new Date(
            d_fecha_inicio as string
          ).toISOString()}::timestamp AND ${new Date(
          d_fecha_fin as string
        ).toISOString()}::timestamp;
        `;
      }

      // Map BigInt to String
      const parsedResult = result.map((row: any) => {
        return Object.fromEntries(
          Object.entries(row).map(([key, value]) => [
            key,
            typeof value === "bigint" ? value.toString() : value,
          ])
        );
      });

      res.status(200).json(parsedResult);
    } catch (error) {
      console.error("Request error", error);
      res.status(500).json({ error: "Error al ejecutar la consulta" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
