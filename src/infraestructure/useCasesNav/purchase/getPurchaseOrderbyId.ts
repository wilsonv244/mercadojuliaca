import { responsePurchaseOrder } from "@/domain/models/clientNavModel/purchase/getPurchaseRequest";
import { PurchaseOrderWithRequest } from "@/domain/models/serverModel/purchase/GetPurchaseOrderModel";
import { PurchaseRequest } from "@prisma/client";

export async function getPurchaseOrderById(
  id_order: number
): Promise<responsePurchaseOrder> {
  let responsePurchase: responsePurchaseOrder = {
    ruc: "",
    supplier_name: "",
    cost: 0,
    legal_name: "",
    status_code: 500,
    message: "Error desconocido",
  };

  try {
    const response = await fetch(
      `/api/purchase/getPurchaseOrderbyId?id_order=${id_order}`
    );
    console.log(response);
    if (!response.ok) {
      return {
        ...responsePurchase,
        status_code: response.status,
        message: `Error al obtener la solicitud de compra: ${response.statusText}`,
      };
    }

    const data: PurchaseOrderWithRequest = await response.json();

    return {
      ruc: data.purchaseSupplier.ruc,
      supplier_name: data.purchaseSupplier.supplier_name,
      legal_name: data.purchaseSupplier.legal_name,
      cost: data.total_amount,
      status_code: 200,
      message: "OK",
    };
  } catch (error) {
    return {
      ...responsePurchase,
      message: `Error al llamar a la API: ${error}`,
    };
  }
}
