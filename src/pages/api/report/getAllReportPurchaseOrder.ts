// pages/api/purchase-details/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/infraestructure/postgressDB/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const result = await prisma.$queryRaw`
        SELECT
          pr.id_request as sol_num,
          COALESCE(cc2.cost_center_name, 'N/A') AS sol_cen_costo,
          cc.cost_center_name as sol_sub_cen_costo,
          pr.request_date as sol_fecha,
          pr.item as sol_articulo,
          pr.description as sol_descripcion,
          pr.quantity as sol_cantidad,
          pr.unit_of_measurement as sol_unidad_medida,
          pr.planned_cost as sol_costo_planificado,
          CASE
            WHEN pr.is_approved = TRUE THEN 'APROBADO'
            ELSE 'POR APROBAR'
          END AS sol_estado,
          CASE
            WHEN pr.is_approved = TRUE THEN 'GERENTE GENERAL'
            ELSE ''
          END AS sol_aprobado_por,
          po.id_order as ord_nro,
          po.order_date as ord_fecha,
          po.total_amount as ord_monto_total,
          0 as ord_monto_sin_igv,
          0 as ord_igv,
          s.ruc as ord_prov_ruc,
          s.legal_name as ord_prov_razon,
          ps.id_shipment as emb_nro,
          ps.shipment_date as emb_fecha,
          ps.receipt_type as emb_tipo_recibo,
          ps.receipt_number as emb_nro_recibo,
          ps.payment_due_date as emb_fecha_venc,
          ps.payment_type as emb_tipo_pago,
          CASE
            WHEN ps.payment_status = TRUE THEN 'PAGADO'
            ELSE 'PENDIENTE DE PAGO'
          END AS emb_estado,
          ps.created_at as fecha_registro
        FROM 
          public."PurchaseShipment" ps
        JOIN 
          public."PurchaseOrder" po ON ps.id_order = po.id_order
        JOIN
          public."PurchaseRequest" pr ON po.id_request = pr.id_request
        JOIN 
          public."Supplier" s ON po.id_supplier = s.id_supplier
        INNER JOIN 
          public."CostCenter" cc ON pr.id_cost_center = cc.id_center
        LEFT JOIN 
          public."CostCenter" cc2 on cc.id_father_center = cc2.id_center
        WHERE 
          ps.is_active = true 
          AND po.is_active = true 
          AND pr.is_active = true;
      `;

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
