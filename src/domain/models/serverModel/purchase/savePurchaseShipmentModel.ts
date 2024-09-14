export interface PurchaseShipment {
  id_order: number;
  shipment_date: Date;
  receipt_type: string;
  receipt_number: string;
  payment_type: string;
  payment_due_date: Date;
  payment_status: boolean;
}
