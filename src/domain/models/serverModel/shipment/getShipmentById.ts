import { Decimal } from "@prisma/client/runtime/library";

interface Supplier {
  id_supplier: number;
  id_entity: number | null;
  ruc: string;
  supplier_name: string;
  legal_name: string | null;
  phone_number: string;
  phone_number2: string | null;
  created_at: Date;
  updated_at: Date;
}

interface Order {
  id_order: number;
  id_request: number;
  id_supplier: number;
  order_date: Date; // Formato de fecha en ISO
  total_amount: Decimal;
  created_at: Date;
  updated_at: Date;
  supplier: Supplier;
}

interface Shipment {
  id_shipment: number;
  id_order: number;
  shipment_date: Date; // Formato de fecha en ISO
  receipt_type: string | null;
  receipt_number: string;
  payment_type: string;
  payment_due_date: Date; // Formato de fecha en ISO
  payment_status: boolean;
  created_at: Date;
  updated_at: Date;
  order: Order;
}

export default interface ShipmentPaymentResponse {
  id_payment: number;
  id_shipment: number;
  payment_date: Date; // Formato de fecha en ISO
  payment_amount: Decimal;
  description: string | null;
  is_credit_note: boolean;
  payment_receipt_number: string | null;
  created_at: Date;
  updated_at: Date;
  shipment: Shipment;
}
