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
    let url = "";
    console.log("url");
    console.log(id_order);
    console.log(receipt_number);
    // Determinar qué parámetro usar en la búsqueda
    if (id_order) {
      url = `/api/shipment/getShipmentPayment?id_shipment=${id_order}`;
    } else if (receipt_number) {
      url = `/api/shipment/getShipmentPayment?receipt_number=${receipt_number}`;
    } else {
      return {
        ...paymentData,
        status_code: 400,
        message: "Debe proporcionar id_order o receipt_number para la búsqueda",
      };
    }

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

    const amount_pending_data: number = data.reduce(
      (total, venta) =>
        total +
        (venta.is_credit_note
          ? -Math.abs(Number(venta.payment_amount)) || 0
          : Number(venta.payment_amount) || 0),
      0
    );

    console.log("amount_pending_data2");
    console.log(amount_pending_data);

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
      message: `Error al llamar a la API: ${error || error}`,
    };
  }
}
