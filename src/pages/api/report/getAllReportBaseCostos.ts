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
      if (d_fecha_inicio == "null " || d_fecha_fin == "null") {
        result = await prisma.$queryRaw`
select
	-- SOLICITUD DE COMPRA
    pr.id_request as sol_num,
    cc2.cost_center_name as sol_cen_costo,
    cc.cost_center_name as sol_sub_cen_costo,    
    to_char(pr.request_date, 'DD-MM-YYYY HH24:MI:SS') as sol_fecha,
    pr.item as sol_articulo,
    pr.description as sol_descripcion,
    pr.quantity as sol_cantidad,
    pr.unit_of_measurement as sol_unidad_medida,
    pr.planned_cost as sol_costo_planificado,
    CASE
        WHEN pr.is_approved = TRUE 
        	THEN 'APROBADO'
        ELSE 'POR APROBAR'
    END AS sol_estado,
    CASE
        WHEN pr.is_approved = TRUE 
        	THEN 'GERENTE GENERAL'
        ELSE ''
    END AS sol_aprobado_por,
    --- Orden de compra
    po.id_order as ord_nro,
    to_char(po.order_date, 'DD-MM-YYYY HH24:MI:SS') as ord_fecha,
    po.total_amount as ord_monto_total,
    0 as ord_monto_sin_igv,
    0 as ord_igv,
    s.ruc as ord_proveedor_ruc,
    s.legal_name as ord_proveedor_razon,
    --- Embarque
    ps.id_shipment as emb_nro,   
    to_char(ps.shipment_date, 'DD-MM-YYYY HH24:MI:SS') as emb_fecha,
    ps.receipt_type as emb_tipo_recibo,
    ps.receipt_number as emb_nro_recibo,    
    to_char(ps.payment_due_date , 'DD-MM-YYYY HH24:MI:SS') as emb_fecha_venc,    
    CASE
        WHEN ps.payment_status = TRUE 
        	THEN 'PAGADO'
        ELSE 'PENDIENTE DE PAGO'
    END AS emb_estado,
    (SELECT 
    	COALESCE(SUM(sp.payment_amount), 0)
    	FROM public.shipment_payments  sp 
    	WHERE sp.id_shipment = ps.id_shipment
    		and sp.is_credit_note = false) AS abono_total,
    -(SELECT 
    	COALESCE(SUM(sp.payment_amount), 0) 
    	FROM  public.shipment_payments sp 
    	WHERE sp.id_shipment = ps.id_shipment
    		and sp.is_credit_note = true) AS nota_credito_total,
    (po.total_amount - (SELECT COALESCE(SUM(sp.payment_amount), 0)  
                        FROM  public.shipment_payments sp 
                        WHERE sp.id_shipment = ps.id_shipment and sp.is_credit_note = false)) AS saldo_total,
    to_char(ps.created_at, 'DD-MM-YYYY HH24:MI:SS') as fecha_registro
FROM 
     public."PurchaseShipment" ps
JOIN 
    public."PurchaseOrder" po ON ps.id_order = po.id_order
JOIN
    public."PurchaseRequest" pr ON po.id_request = pr.id_request
JOIN 
    public."Supplier" s ON po.id_supplier = s.id_supplier
inner JOIN 
    public."CostCenter" cc ON pr.id_cost_center = cc.id_center
left join 
	public."CostCenter" cc2 on cc.id_father_center = cc2.id_center
where 
	ps.is_active = true and 
	po.is_active = true and 	
	pr.is_active = true;
          
      `;
      } else {
        result = await prisma.$queryRaw`
       select
	-- SOLICITUD DE COMPRA
    pr.id_request as sol_num,
    cc2.cost_center_name as sol_cen_costo,
    cc.cost_center_name as sol_sub_cen_costo,    
    to_char(pr.request_date, 'DD-MM-YYYY HH24:MI:SS') as sol_fecha,
    pr.item as sol_articulo,
    pr.description as sol_descripcion,
    pr.quantity as sol_cantidad,
    pr.unit_of_measurement as sol_unidad_medida,
    pr.planned_cost as sol_costo_planificado,
    CASE
        WHEN pr.is_approved = TRUE 
        	THEN 'APROBADO'
        ELSE 'POR APROBAR'
    END AS sol_estado,
    CASE
        WHEN pr.is_approved = TRUE 
        	THEN 'GERENTE GENERAL'
        ELSE ''
    END AS sol_aprobado_por,
    --- Orden de compra
    po.id_order as ord_nro,
    to_char(po.order_date, 'DD-MM-YYYY HH24:MI:SS') as ord_fecha,
    po.total_amount as ord_monto_total,
    0 as ord_monto_sin_igv,
    0 as ord_igv,
    s.ruc as ord_proveedor_ruc,
    s.legal_name as ord_proveedor_razon,
    --- Embarque
    ps.id_shipment as emb_nro,   
    to_char(ps.shipment_date, 'DD-MM-YYYY HH24:MI:SS') as emb_fecha,
    ps.receipt_type as emb_tipo_recibo,
    ps.receipt_number as emb_nro_recibo,    
    to_char(ps.payment_due_date , 'DD-MM-YYYY HH24:MI:SS') as emb_fecha_venc,    
    CASE
        WHEN ps.payment_status = TRUE 
        	THEN 'PAGADO'
        ELSE 'PENDIENTE DE PAGO'
    END AS emb_estado,
    (SELECT 
    	COALESCE(SUM(sp.payment_amount), 0)
    	FROM public.shipment_payments  sp 
    	WHERE sp.id_shipment = ps.id_shipment
    		and sp.is_credit_note = false) AS abono_total,
    -(SELECT 
    	COALESCE(SUM(sp.payment_amount), 0) 
    	FROM  public.shipment_payments sp 
    	WHERE sp.id_shipment = ps.id_shipment
    		and sp.is_credit_note = true) AS nota_credito_total,
    (po.total_amount - (SELECT COALESCE(SUM(sp.payment_amount), 0)  
                        FROM  public.shipment_payments sp 
                        WHERE sp.id_shipment = ps.id_shipment and sp.is_credit_note = false)) AS saldo_total,
    to_char(ps.created_at, 'DD-MM-YYYY HH24:MI:SS') as fecha_registro
FROM 
     public."PurchaseShipment" ps
JOIN 
    public."PurchaseOrder" po ON ps.id_order = po.id_order
JOIN
    public."PurchaseRequest" pr ON po.id_request = pr.id_request
JOIN 
    public."Supplier" s ON po.id_supplier = s.id_supplier
inner JOIN 
    public."CostCenter" cc ON pr.id_cost_center = cc.id_center
left join 
	public."CostCenter" cc2 on cc.id_father_center = cc2.id_center
where 
	ps.is_active = true and 
	po.is_active = true and 	
	pr.is_active = true
          and pr.request_date between ${new Date(
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
