export interface Employee {
  id_employee: number;
  id_entity: number | null;
  id_channel: number;
  document_type: number;
  document_number: string;
  last_name: string;
  first_name: string | null;
  phone_number: string | null;
  phone_number2?: string | null;
  address: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface OptionSeller {
  name: string;
  code: string;
}

export interface OptionMenu {
  label: string;
  value: string;
}
