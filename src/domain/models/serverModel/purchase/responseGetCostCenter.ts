export interface CostCenter {
  id_center: number;
  id_father_center?: number;
  cost_center_name: string;
  created_at: Date;
  updated_at: Date;
}
