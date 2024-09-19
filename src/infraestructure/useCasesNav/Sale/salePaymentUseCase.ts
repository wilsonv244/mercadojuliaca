import { ResponseSalePayment } from "@/domain/models/clientNavModel/Sale";
import { SaleEntity } from "@/domain/models/serverModel/client/responseGetSaleModel";

export async function getSaleByReceiptNumber(
  receiptNumber: string
): Promise<ResponseSalePayment> {
  const initialResponse: ResponseSalePayment = {
    total_amount: 0,
    deuda_total: 0,
    statusCode: 200,
    message: "",
    id_sale: 0,
  };

  try {
    const saleResponse = await fetch(
      `/api/sale/getSaleByReceip?receipt_number=${receiptNumber}`
    );

    if (saleResponse.status === 204) {
      return {
        ...initialResponse,
        statusCode: 204,
        message: "No se encontraron datos con ese Recibo",
      };
    }
    const paymentData: SaleEntity[] = await saleResponse.json();

    const sale = paymentData[0];

    const totalPaid = sale.SalePayments.reduce(
      (total, item) => total + Number(item.payment_amount),
      0
    );

    return {
      total_amount: Number(sale.total_amount),
      deuda_total: Number(
        totalPaid == 0
          ? sale.total_amount
          : Number(sale.total_amount) - totalPaid
      ),
      statusCode: 200,
      message: "success",
      id_sale: sale.id_sale,
    };
  } catch (error) {
    console.error("Error al obtener la información de la venta:", error);
    return {
      ...initialResponse,
      statusCode: 500,
      message: "Ocurrió un error: " + (error as Error).message,
    };
  }
}
