import { Decimal } from "@prisma/client/runtime/library";

// Interfaz para SalePayment
export interface SalePayment {
  id_payment: number;
  id_sale: number;
  id_employee: number;
  payment_registration_date: Date;
  description?: string | null;
  payment_amount: Decimal;
  is_credit_note: boolean;
  payment_receipt_number?: string | null;
  created_at: Date;
  updated_at: Date;
}

// Interfaz para Sale
export interface Sale {
  id_sale: number;
  id_employee: number;
  id_client: number;
  receipt_type?: string | null;
  receipt_number: string;
  receipt_date: Date;
  total_amount: Decimal;
  status: boolean;
  created_at: Date;
  updated_at: Date;
  SalePayments: SalePayment[]; // Relación con SalePayment
}

// Respuesta de la API
export interface SalePaymentResponse {
  salePayments?: Sale[];
  error?: string;
}
