export interface responsePurchaseRequ {
  id_request: number;
  item: string;
  quantity: number;
  unit_of_measurement: string;
  planned_cost: number;
  status_code: number | null;
  message: string | null;
}
