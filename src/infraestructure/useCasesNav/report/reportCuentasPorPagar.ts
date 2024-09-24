import {
  PurchaseDetail,
  PurchaseDetailResponse,
} from "@/domain/models/clientNavModel/report/getCuentasPagarResponse";
import { ResponseSalePayment } from "@/domain/models/clientNavModel/Sale";
import { SaleEntity } from "@/domain/models/serverModel/client/responseGetSaleModel";
import { NextApiResponse } from "next";

export async function getCuentasPorPagar(
  d_fecha_inicio: Date,
  d_fecha_fin: Date
): Promise<PurchaseDetailResponse> {
  const initialResponse: PurchaseDetail = {
    sol_num: 0,
    sol_cen_costo: "",
    sol_sub_cen_costo: "",
    sol_fecha: "",
    sol_articulo: "",
    sol_descripcion: "",
    sol_cantidad: "",
    sol_unidad_medida: "",
    sol_costo_planificado: "",
    sol_estado: "",
    sol_aprobado_por: "",
    ord_nro: 0,
    ord_fecha: new Date(),
    ord_monto_total: "",
    ord_monto_sin_igv: 0,
    ord_igv: 0,
    ord_prov_ruc: "",
    ord_prov_razon: "",
    emb_nro: 0,
    emb_fecha: "",
    emb_tipo_recibo: "",
    emb_nro_recibo: "",
    emb_fecha_venc: "",
    emb_tipo_pago: "",
    emb_estado: "",
    fecha_registro: "",
  };

  try {
    console.log(d_fecha_fin);
    console.log(d_fecha_inicio);
    const saleResponse = await fetch(
      `/api/report/getAllReportPurchaseOrder?d_fecha_inicio=${d_fecha_inicio}&d_fecha_fin=${d_fecha_fin}`
    );
    console.log(saleResponse);
    if (saleResponse.status === 204) {
      return {
        lsPurchaseDetail: [initialResponse],
        statusCode: 204,
        message: "No se encontraron datos con ese Recibo",
      };
    }
    const paymentData: PurchaseDetail[] = await saleResponse.json();

    return {
      lsPurchaseDetail: paymentData,
      statusCode: 200,
      message: "success",
    };
  } catch (error) {
    console.error("Error al obtener la información de la venta:", error);
    return {
      lsPurchaseDetail: [initialResponse],
      statusCode: 500,
      message: "Ocurrió un error: " + (error as Error).message,
    };
  }
}
