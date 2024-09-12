import { Decimal } from "@prisma/client/runtime/library";

export interface PurchaseOrderRequest {
  id_request: number;
  id_supplier: number;
  order_date: Date;
  total_amount: Decimal;
}

export interface PurchaseOrderResponse {
  success: boolean;
  message: string;
  purchaseOrder?: PurchaseOrderRequest;
}
