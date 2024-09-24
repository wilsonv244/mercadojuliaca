export interface PurchaseDetail {
  sol_num: number;
  sol_cen_costo: string;
  sol_sub_cen_costo: string;
  sol_fecha: string; // Si estás manejando fechas, podrías usar `Date`
  sol_articulo: string;
  sol_descripcion: string;
  sol_cantidad: string;
  sol_unidad_medida: string;
  sol_costo_planificado: string;
  sol_estado: string;
  sol_aprobado_por: string;
  ord_nro: number;
  ord_fecha: Date; // También podría ser `Date`
  ord_monto_total: string;
  ord_monto_sin_igv: number;
  ord_igv: number;
  ord_prov_ruc: string;
  ord_prov_razon: string;
  emb_nro: number;
  emb_fecha: string; // También podría ser `Date`
  emb_tipo_recibo: string;
  emb_nro_recibo: string;
  emb_fecha_venc: string; // También podría ser `Date`
  emb_tipo_pago: string;
  emb_estado: string;
  fecha_registro: string; // También podría ser `Date`
}

export interface PurchaseDetailResponse {
  lsPurchaseDetail: PurchaseDetail[];
  statusCode: Number;
  message: string | null;
}
