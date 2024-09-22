export interface Supplier {
  id_supplier: number;
  id_entity?: number | null;
  ruc: string;
  supplier_name: string;
  legal_name?: string | null;
  phone_number: string;
  phone_number2?: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface SuppliersResponse {
  suppliers?: Supplier[];
  error?: string;
}
