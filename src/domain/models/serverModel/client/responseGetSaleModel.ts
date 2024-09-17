import { Decimal } from "@prisma/client/runtime/library";

export interface SalePayment {
  payment_amount: Decimal;
  is_credit_note: boolean;
  description: string | null;
  payment_registration_date: Date | null;
}

export interface SaleEntity {
  id_sale: number;
  id_employee: number;
  id_client: number;
  total_amount: Decimal;
  receipt_date: Date;
  SalePayments: SalePayment[];
}
