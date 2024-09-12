export interface PurchaseRequest {
  id_request: number;
  id_cost_center: number;
  request_date: Date;
  item: string;
  description: string;
  quantity: number;
  unit_of_measurement: string;
  planned_cost: number;
}
