import { Decimal } from "@prisma/client/runtime/library";

export interface PurchaseRequest {
  id_request: number;
  item: string;
  description: string | null;
  quantity: Decimal;
  unit_of_measurement: string;
  planned_cost: number;
}

export interface PurchaseOrderWithRequest {
  id_order: number;
  id_request: number;
  id_supplier: number;
  order_date: string;
  total_amount: number;
  purchaseRequest: PurchaseRequest;
}
