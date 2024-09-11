export interface ResponseSalePayment {
  deuda_total: Number | null;
  total_amount: Number | null;
  statusCode: Number;
  message: string | null;
  id_sale: Number | null;
}
