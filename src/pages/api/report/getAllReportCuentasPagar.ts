// pages/api/purchase-details/index.ts
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
      if (d_fecha_inicio == "null " || d_fecha_fin == "null") {
        result = await prisma.$queryRaw`

        SELECT
        -- SOLICITUD DE COMPRA
        pr.id_request AS sol_num,
        cc2.cost_center_name AS sol_cen_costo,
        cc.cost_center_name AS sol_sub_cen_costo,    
        to_char(pr.request_date, 'DD-MM-YYYY') AS sol_fecha,
        pr.item AS sol_articulo,
        pr.description AS sol_descripcion,
        pr.quantity AS sol_cantidad,
        pr.unit_of_measurement AS sol_unidad_medida,
        pr.planned_cost AS sol_costo_planificado,
        CASE
            WHEN pr.is_approved = TRUE THEN 'APROBADO'
            ELSE 'POR APROBAR'
        END AS sol_estado,
        CASE
            WHEN pr.is_approved = TRUE THEN 'GERENTE GENERAL'
            ELSE ''
        END AS sol_aprobado_por,
    
        -- ORDEN DE COMPRA
        po.id_order AS ord_nro,
        to_char(po.order_date, 'DD-MM-YYYY') AS ord_fecha,
        po.total_amount AS ord_monto_total,
        0 AS ord_monto_sin_igv,
        0 AS ord_igv,
        s.ruc AS ord_proveedor_ruc,
        s.legal_name AS ord_proveedor_razon,
    
        -- EMBARQUE
        ps.id_shipment AS emb_nro,   
        to_char(ps.shipment_date, 'DD-MM-YYYY HH24:MI:SS') AS emb_fecha,
        ps.receipt_type AS emb_tipo_recibo,
        ps.receipt_number AS emb_nro_recibo,    
        to_char(ps.payment_due_date, 'DD-MM-YYYY') AS emb_fecha_venc,    
        CASE
            WHEN ps.payment_status = TRUE THEN 'PAGADO'
            ELSE 'PENDIENTE DE PAGO'
        END AS emb_estado,
    
        -- ABONOS Y SALDO
        (SELECT COALESCE(SUM(sp.payment_amount), 0)
         FROM public.shipment_payments sp 
         WHERE sp.id_shipment = ps.id_shipment
           AND sp.is_credit_note = false) AS abono_total,
    
        -(SELECT COALESCE(SUM(sp.payment_amount), 0)
          FROM public.shipment_payments sp
          WHERE sp.id_shipment = ps.id_shipment
            AND sp.is_credit_note = true) AS nota_credito_total,
    
        (po.total_amount - (SELECT COALESCE(SUM(sp.payment_amount), 0)
                            FROM public.shipment_payments sp  
                            WHERE sp.id_shipment = ps.id_shipment
                              AND sp.is_credit_note = false)) AS saldo_total,
    
        -- MONTO TOTAL CON NOTA DE CRÉDITO
        (po.total_amount - (SELECT COALESCE(SUM(sp.payment_amount), 0)
                            FROM public.shipment_payments sp
                            WHERE sp.id_shipment = ps.id_shipment
                              AND sp.is_credit_note = true)) AS monto_total_desc_nota_cred,
    
        -- ESTADO FINAL DE PAGO
        CASE
            WHEN (po.total_amount - (SELECT COALESCE(SUM(sp.payment_amount), 0)
                                     FROM public.shipment_payments sp
                                     WHERE sp.id_shipment = ps.id_shipment
                                       AND sp.is_credit_note = false)) = 0 
            THEN 'Pagado'
            ELSE 'Pendiente'
        END AS estado_final_pago,
    
        -- DÍAS DE ATRASO
        EXTRACT(DAY FROM CURRENT_DATE - CAST(po.order_date AS timestamp)) AS dias_atrazo,
    
        -- NÚMERO DE CUOTAS
        (SELECT COALESCE(COUNT(sp.*), 0)
         FROM public.shipment_payments sp
         WHERE sp.id_shipment = ps.id_shipment
           AND sp.is_credit_note = false) AS nro_cuotas,
    
        -- NOTIFICACIÓN
        CASE
            WHEN (po.total_amount - (SELECT COALESCE(SUM(sp.payment_amount), 0)
                                     FROM public.shipment_payments sp
                                     WHERE sp.id_shipment = ps.id_shipment
                                       AND sp.is_credit_note = false)) = 0
            THEN 'No tienes facturas por cobrar'
            ELSE 'Factura pendiente por cobrar'
        END AS notificacion
    
    FROM 
        public."PurchaseShipment" ps
    JOIN 
        public."PurchaseOrder" po ON ps.id_order = po.id_order
    JOIN
        public."PurchaseRequest" pr ON po.id_request = pr.id_request
    JOIN 
        public."Supplier" s ON po.id_supplier = s.id_supplier
    JOIN 
        public."CostCenter" cc ON pr.id_cost_center = cc.id_center
    LEFT JOIN 
        public."CostCenter" cc2 ON cc.id_father_center = cc2.id_center
    WHERE 
        ps.is_active = TRUE 
        AND po.is_active = TRUE 
        AND pr.is_active = TRUE;
          
      `;
      } else {
        result = await prisma.$queryRaw`
      
SELECT
    -- SOLICITUD DE COMPRA
    pr.id_request AS sol_num,
    cc2.cost_center_name AS sol_cen_costo,
    cc.cost_center_name AS sol_sub_cen_costo,    
    to_char(pr.request_date, 'DD-MM-YYYY') AS sol_fecha,
    pr.item AS sol_articulo,
    pr.description AS sol_descripcion,
    pr.quantity AS sol_cantidad,
    pr.unit_of_measurement AS sol_unidad_medida,
    pr.planned_cost AS sol_costo_planificado,
    CASE
        WHEN pr.is_approved = TRUE THEN 'APROBADO'
        ELSE 'POR APROBAR'
    END AS sol_estado,
    CASE
        WHEN pr.is_approved = TRUE THEN 'GERENTE GENERAL'
        ELSE ''
    END AS sol_aprobado_por,

    -- ORDEN DE COMPRA
    po.id_order AS ord_nro,
    to_char(po.order_date, 'DD-MM-YYYY') AS ord_fecha,
    po.total_amount AS ord_monto_total,
    0 AS ord_monto_sin_igv,
    0 AS ord_igv,
    s.ruc AS ord_proveedor_ruc,
    s.legal_name AS ord_proveedor_razon,

    -- EMBARQUE
    ps.id_shipment AS emb_nro,   
    to_char(ps.shipment_date, 'DD-MM-YYYY HH24:MI:SS') AS emb_fecha,
    ps.receipt_type AS emb_tipo_recibo,
    ps.receipt_number AS emb_nro_recibo,    
    to_char(ps.payment_due_date, 'DD-MM-YYYY') AS emb_fecha_venc,    
    CASE
        WHEN ps.payment_status = TRUE THEN 'PAGADO'
        ELSE 'PENDIENTE DE PAGO'
    END AS emb_estado,

    -- ABONOS Y SALDO
    (SELECT COALESCE(SUM(sp.payment_amount), 0)
     FROM public.shipment_payments sp 
     WHERE sp.id_shipment = ps.id_shipment
       AND sp.is_credit_note = false) AS abono_total,

    -(SELECT COALESCE(SUM(sp.payment_amount), 0)
      FROM public.shipment_payments sp
      WHERE sp.id_shipment = ps.id_shipment
        AND sp.is_credit_note = true) AS nota_credito_total,

    (po.total_amount - (SELECT COALESCE(SUM(sp.payment_amount), 0)
                        FROM public.shipment_payments sp  
                        WHERE sp.id_shipment = ps.id_shipment
                          AND sp.is_credit_note = false)) AS saldo_total,

    -- MONTO TOTAL CON NOTA DE CRÉDITO
    (po.total_amount - (SELECT COALESCE(SUM(sp.payment_amount), 0)
                        FROM public.shipment_payments sp
                        WHERE sp.id_shipment = ps.id_shipment
                          AND sp.is_credit_note = true)) AS monto_total_desc_nota_cred,

    -- ESTADO FINAL DE PAGO
    CASE
        WHEN (po.total_amount - (SELECT COALESCE(SUM(sp.payment_amount), 0)
                                 FROM public.shipment_payments sp
                                 WHERE sp.id_shipment = ps.id_shipment
                                   AND sp.is_credit_note = false)) = 0 
        THEN 'Pagado'
        ELSE 'Pendiente'
    END AS estado_final_pago,

    -- DÍAS DE ATRASO
    EXTRACT(DAY FROM CURRENT_DATE - CAST(po.order_date AS timestamp)) AS dias_atrazo,

    -- NÚMERO DE CUOTAS
    (SELECT COALESCE(COUNT(sp.*), 0)
     FROM public.shipment_payments sp
     WHERE sp.id_shipment = ps.id_shipment
       AND sp.is_credit_note = false) AS nro_cuotas,

    -- NOTIFICACIÓN
    CASE
        WHEN (po.total_amount - (SELECT COALESCE(SUM(sp.payment_amount), 0)
                                 FROM public.shipment_payments sp
                                 WHERE sp.id_shipment = ps.id_shipment
                                   AND sp.is_credit_note = false)) = 0
        THEN 'No tienes facturas por cobrar'
        ELSE 'Factura pendiente por cobrar'
    END AS notificacion

FROM 
    public."PurchaseShipment" ps
JOIN 
    public."PurchaseOrder" po ON ps.id_order = po.id_order
JOIN
    public."PurchaseRequest" pr ON po.id_request = pr.id_request
JOIN 
    public."Supplier" s ON po.id_supplier = s.id_supplier
JOIN 
    public."CostCenter" cc ON pr.id_cost_center = cc.id_center
LEFT JOIN 
    public."CostCenter" cc2 ON cc.id_father_center = cc2.id_center
WHERE 
    ps.is_active = TRUE 
    AND po.is_active = TRUE 
    AND pr.is_active = TRUE
          and pr.request_date between ${new Date(
            d_fecha_inicio as string
          ).toISOString()}::timestamp and ${new Date(
          d_fecha_fin as string
        ).toISOString()}::timestamp;
      `;
      }

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
