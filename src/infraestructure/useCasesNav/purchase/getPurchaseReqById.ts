import { responsePurchaseRequ } from "@/domain/models/clientNavModel/purchase/getPurchaseRequest";
import { PurchaseRequest } from "@prisma/client";

export async function getPurchaseById(
  idSolicitud: number
): Promise<responsePurchaseRequ> {
  let responsePurchase: responsePurchaseRequ = {
    id_request: 0,
    item: "",
    quantity: 0,
    unit_of_measurement: "",
    planned_cost: 0,
    status_code: 500,
    message: "Error desconocido",
  };

  try {
    const response = await fetch(
      `/api/purchase/getPurchaseRequest?id_request=${idSolicitud}`
    );
    console.log(response);
    if (!response.ok) {
      return {
        ...responsePurchase,
        status_code: response.status,
        message: `Error al obtener la solicitud de compra: ${response.statusText}`,
      };
    }

    const data: PurchaseRequest = await response.json();

    return {
      id_request: data.id_request,
      item: data.item,
      quantity: Number(data.quantity),
      unit_of_measurement: data.unit_of_measurement,
      planned_cost: Number(data.planned_cost),
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
