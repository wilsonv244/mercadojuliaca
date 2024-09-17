interface PaymentInfo {
  id_shipment: number;
  ruc: string;
  supplier_name: string;
  legal_name: string | null;
  total_amount: number;
  amount_pending: number;
  payment_due_date: Date;
  status_code: number;
  message: string;
}
