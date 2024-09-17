-- AlterTable
ALTER TABLE "SalePayment" ADD COLUMN     "is_credit_note" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "payment_receipt_number" TEXT DEFAULT '';

-- AlterTable
ALTER TABLE "ShipmentPayment" ADD COLUMN     "description" TEXT,
ADD COLUMN     "is_credit_note" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "payment_receipt_number" TEXT;
