import { PurchaseOrderWithRequest } from "@/domain/models/serverModel/purchase/GetPurchaseOrderModel";
import ShipmentPaymentResponse from "@/domain/models/serverModel/shipment/getShipmentById";

export async function getShipPayDataByIdUseCase(
  id_order?: number,
  receipt_number?: string
): Promise<PaymentInfo> {
  let paymentData: PaymentInfo = {
    id_shipment: 0,
    ruc: "",
    supplier_name: "",
    legal_name: "",
    total_amount: 0,
    amount_pending: 0,
    payment_due_date: new Date(),
    status_code: 500,
    message: "",
  };

  try {
    // Validate input parameters
    if (!id_order && !receipt_number) {
      return {
        ...paymentData,
        status_code: 400,
        message: "Debe proporcionar id_order o receipt_number para la búsqueda",
      };
    }

    // Construct the query string based on the input parameters
    const params = new URLSearchParams();
    if (id_order) params.append("id_shipment", id_order.toString());
    if (receipt_number) params.append("receipt_number", receipt_number);

    const url = `/api/shipment/getShipmentPayment?${params.toString()}`;

    const response = await fetch(url);

    if (!response.ok) {
      return {
        ...paymentData,
        status_code: response.status,
        message: `Error al obtener la solicitud de compra: ${response.statusText}`,
      };
    }

    const data: ShipmentPaymentResponse[] = await response.json();

    if (!data || data.length === 0) {
      return {
        ...paymentData,
        status_code: 404,
        message: "No se encontraron datos para la orden de compra",
      };
    }

    const order = data[0].shipment.order;
    const total_amount: number = Number(order.total_amount);

    // Calculate the pending amount
    const amount_pending_data: number = data.reduce(
      (total, venta) => total + Number(venta.payment_amount),
      0
    );

    const isPaid = amount_pending_data >= total_amount;

    return {
      id_shipment: data[0].id_shipment,
      ruc: order.supplier.ruc,
      supplier_name: order.supplier.supplier_name,
      legal_name: order.supplier.legal_name,
      total_amount,
      amount_pending: total_amount - amount_pending_data,
      payment_due_date: new Date(data[0].shipment.payment_due_date),
      status_code: isPaid ? 422 : 200,
      message: isPaid ? "La orden de compra ya fue cancelada" : "OK",
    };
  } catch (error) {
    return {
      ...paymentData,
      message: `Error al llamar a la API: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}
