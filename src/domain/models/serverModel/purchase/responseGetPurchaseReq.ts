import { Decimal } from "@prisma/client/runtime/library";

export interface PurchaseRequest {
  id_request: number;
  id_cost_center: number;
  request_date: Date;
  item: string;
  description: string | null;
  quantity: Decimal;
  unit_of_measurement: string;
  planned_cost: Decimal;
}

export interface ApiResponse {
  status_code: number;
  data?: PurchaseRequest[];
  message?: string;
}
