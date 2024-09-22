import { Decimal } from "@prisma/client/runtime/library";

export interface Supplier {
  legal_name: string | null;
}

export interface PurchaseRequest {
  item: string;
  description?: string | null;
  quantity: Decimal;
  unit_of_measurement: string;
  planned_cost: Decimal;
}

export interface PurchaseOrderResponseServer {
  id_order: number;
  order_date: Date;
  id_request: number;
  total_amount: Decimal;
  request: PurchaseRequest;
  supplier: Supplier;
}
