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
      let result = "";
      console.log(d_fecha_fin);
      console.log(d_fecha_inicio);
      if (d_fecha_inicio == "null " || d_fecha_fin == "null") {
        result = await prisma.$queryRaw`
          SELECT
    -- SOLICITUD DE COMPRA
    pr.id_request AS sol_num,
    cc2.cost_center_name AS sol_cen_costo,
    cc.cost_center_name AS sol_sub_cen_costo,    
    pr.request_date AS sol_fecha,
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
    
    --- ORDEN DE COMPRA
    po.id_order AS ord_nro,
    po.order_date AS ord_fecha,
    po.total_amount AS ord_monto_total,
    0 AS ord_monto_sin_igv,
    0 AS ord_igv,
    s.ruc AS ord_proveedor_ruc,
    s.legal_name AS ord_proveedor_razon,

    --- EMBARQUE
    ps.id_shipment AS emb_nro,   
    ps.shipment_date AS emb_fecha,
    ps.receipt_type AS emb_tipo_recibo,
    ps.receipt_number AS emb_nro_recibo,    
    ps.payment_due_date AS emb_fecha_venc,  
    ba.name AS nombre_banco,
    rt.name AS tipo_comprobante,
    sp.operation_number AS nro_operacion,
    
    CASE
        WHEN ps.payment_status = TRUE THEN 'PAGADO'
        ELSE 'PENDIENTE DE PAGO'
    END AS emb_estado,
    CASE
        WHEN sp.is_credit_note = TRUE THEN 'NOTA DE CRÉDITO'
        ELSE 'PAGO DE CUOTA'
    END AS tipo_pago,
    CASE
        WHEN sp.is_credit_note = TRUE THEN -sp.payment_amount
        ELSE sp.payment_amount
    END AS monto_pago,
    sp.description AS descript_pago,
    CASE
        WHEN sp.payment_receipt_number = '' THEN ps.receipt_number
        ELSE sp.payment_receipt_number
    END AS recibo_nro_pago,
    sp.payment_date AS fecha_pago,
CASE 
    WHEN ps.payment_due_date < CURRENT_DATE THEN EXTRACT(DAY FROM CURRENT_DATE - ps.payment_due_date)
    ELSE 0
END AS dias_atrazo
FROM 
    public."PurchaseShipment" ps
JOIN 
    public."PurchaseOrder" po ON ps.id_order = po.id_order
JOIN
    public."PurchaseRequest" pr ON po.id_request = pr.id_request
JOIN 
    public."Supplier" s ON po.id_supplier = s.id_supplier
JOIN
    public.shipment_payments sp ON ps.id_shipment = sp.id_shipment
INNER JOIN 
    public."CostCenter" cc ON pr.id_cost_center = cc.id_center
LEFT JOIN 
    public."CostCenter" cc2 ON cc.id_father_center = cc2.id_center
JOIN
    public.banks ba ON sp.id_bank = ba.id_bank
JOIN
    public.receipt_types rt ON sp.id_receipt_type = rt.id_type
WHERE 
    ps.is_active = TRUE 
    AND po.is_active = TRUE 
    AND pr.is_active = TRUE
ORDER BY sol_num ASC;

  
        `;
      } else {
        result = await prisma.$queryRaw`
   SELECT
    -- SOLICITUD DE COMPRA
    pr.id_request AS sol_num,
    cc2.cost_center_name AS sol_cen_costo,
    cc.cost_center_name AS sol_sub_cen_costo,    
    pr.request_date AS sol_fecha,
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
    
    --- ORDEN DE COMPRA
    po.id_order AS ord_nro,
    po.order_date AS ord_fecha,
    po.total_amount AS ord_monto_total,
    0 AS ord_monto_sin_igv,
    0 AS ord_igv,
    s.ruc AS ord_proveedor_ruc,
    s.legal_name AS ord_proveedor_razon,

    --- EMBARQUE
    ps.id_shipment AS emb_nro,   
    ps.shipment_date AS emb_fecha,
    ps.receipt_type AS emb_tipo_recibo,
    ps.receipt_number AS emb_nro_recibo,    
    ps.payment_due_date AS emb_fecha_venc,  
    ba.name AS nombre_banco,
    rt.name AS tipo_comprobante,
    sp.operation_number AS nro_operacion,
    
    CASE
        WHEN ps.payment_status = TRUE THEN 'PAGADO'
        ELSE 'PENDIENTE DE PAGO'
    END AS emb_estado,
    CASE
        WHEN sp.is_credit_note = TRUE THEN 'NOTA DE CRÉDITO'
        ELSE 'PAGO DE CUOTA'
    END AS tipo_pago,
    CASE
        WHEN sp.is_credit_note = TRUE THEN -sp.payment_amount
        ELSE sp.payment_amount
    END AS monto_pago,
    sp.description AS descript_pago,
    CASE
        WHEN sp.payment_receipt_number = '' THEN ps.receipt_number
        ELSE sp.payment_receipt_number
    END AS recibo_nro_pago,
    sp.payment_date AS fecha_pago,
CASE 
    WHEN ps.payment_due_date < CURRENT_DATE THEN EXTRACT(DAY FROM CURRENT_DATE - ps.payment_due_date)
    ELSE 0
END AS dias_atrazo
FROM 
    public."PurchaseShipment" ps
JOIN 
    public."PurchaseOrder" po ON ps.id_order = po.id_order
JOIN
    public."PurchaseRequest" pr ON po.id_request = pr.id_request
JOIN 
    public."Supplier" s ON po.id_supplier = s.id_supplier
JOIN
    public.shipment_payments sp ON ps.id_shipment = sp.id_shipment
INNER JOIN 
    public."CostCenter" cc ON pr.id_cost_center = cc.id_center
LEFT JOIN 
    public."CostCenter" cc2 ON cc.id_father_center = cc2.id_center
JOIN
    public.banks ba ON sp.id_bank = ba.id_bank
JOIN
    public.receipt_types rt ON sp.id_receipt_type = rt.id_type
WHERE 
    ps.is_active = TRUE 
    AND po.is_active = TRUE 
    AND pr.is_active = TRUE
          and pr.request_date between ${new Date(
            d_fecha_inicio as string
          ).toISOString()}::timestamp and ${new Date(
          d_fecha_fin as string
        ).toISOString()}::timestamp
      ORDER BY sol_num ASC;
      
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
