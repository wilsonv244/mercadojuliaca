export interface ShipmentPaymentData {
  id_shipment: number;
  payment_date: string;
  payment_amount: number;
  description: string | null;
  is_credit_note: boolean;
  payment_receipt_number: string;
}
