import { ResponseSalePayment } from "@/domain/models/clientNavModel/Sale";
import { Sale, SalePayment } from "@prisma/client";

export async function getSaleByReceiptNumber(
  receiptNumber: string
): Promise<ResponseSalePayment> {
  let response: ResponseSalePayment = {
    total_amount: 0,
    deuda_total: 0,
    statusCode: 200,
    message: "",
    id_sale: 0,
  };

  try {
    // Llamar a la API para obtener la venta por número de recibo
    const saleResponse = await fetch(
      `/api/sale/getSaleById?receipt_number=${receiptNumber}`
    );
    console.log("saleResponse");
    console.log(saleResponse);

    if (!saleResponse.ok) {
      throw new Error(`Error al obtener la venta: ${saleResponse.statusText}`);
    }

    const saleData: Sale = await saleResponse.json();
    console.log("saleData");
    console.log(saleData);

    if (!saleData) {
      throw new Error(
        `No se encontró ninguna venta con el número de recibo: ${receiptNumber}`
      );
    }

    // Llamar a la API para obtener los pagos asociados a la venta
    const paymentResponse = await fetch(
      `/api/sale/getSalePaymentById?id_sale=${saleData.id_sale}`
    );
    console.log("paymentResponse");
    console.log(paymentResponse);

    if (!paymentResponse.ok) {
      throw new Error(
        `Error al obtener los pagos: ${paymentResponse.statusText}`
      );
    }

    const paymentData: SalePayment[] = await paymentResponse.json();
    console.log(paymentData);

    if (paymentData.length <= 0) {
      return {
        total_amount: 0,
        deuda_total: 0,
        statusCode: 204,
        message: "No se encontraron datos con ese Recibo",
        id_sale: 0,
      };
    }

    // Calcular la deuda total
    const deudaCalculo: number = paymentData.reduce(
      (total, item) => total + Number(item.payment_amount),
      0
    );

    response = {
      total_amount: Number(saleData.total_amount),
      deuda_total: Number(saleData.total_amount) - deudaCalculo,
      statusCode: 200,
      message: "success",
      id_sale: Number(saleData.id_sale),
    };

    return response;
  } catch (error) {
    console.error("Error al obtener la información de la venta:", error);
    return {
      total_amount: 0,
      deuda_total: 0,
      statusCode: 500,
      message: "Ocurrió un error: " + error,
      id_sale: 0,
    };
  }
}
