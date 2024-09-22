import { Decimal } from "@prisma/client/runtime/library";

interface ShipmentPayment {
  id_payment: number;
  id_shipment: number;
  payment_date: Date;
  payment_amount: Decimal;
  description?: string | null;
  is_credit_note: boolean;
  payment_receipt_number?: string | null;
  created_at: Date;
  updated_at: Date;
}

interface PurchaseShipment {
  id_shipment: number;
  id_order: number;
  shipment_date: Date;
  receipt_type?: string | null;
  receipt_number: string;
  payment_type: string;
  payment_due_date: Date;
  payment_status: boolean;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  ShipmentPayments: ShipmentPayment[]; // Relación con ShipmentPayment
}

interface PurchaseOrder {
  id_order: number;
  id_request: number;
  id_supplier: number;
  order_date: Date;
  total_amount: Decimal;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  PurchaseShipments: PurchaseShipment[]; // Relación con PurchaseShipment
}

interface PurchaseRequest {
  id_request: number;
  id_cost_center: number;
  request_date: Date;
  item: string;
  description?: string | null;
  quantity: Decimal;
  unit_of_measurement: string;
  planned_cost: Decimal;
  is_approved: boolean;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  PurchaseOrders: PurchaseOrder[]; // Relación con PurchaseOrder
}

export interface PurchaseRequestResponse {
  purchaseRequests?: PurchaseRequest[];
  error?: string;
}
