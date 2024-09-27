/*
  Warnings:

  - You are about to drop the `ShipmentPayment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ShipmentPayment" DROP CONSTRAINT "ShipmentPayment_id_shipment_fkey";

-- DropTable
DROP TABLE "ShipmentPayment";

-- CreateTable
CREATE TABLE "receipt_types" (
    "id_type" SERIAL NOT NULL,
    "name" VARCHAR(25) NOT NULL,

    CONSTRAINT "receipt_types_pkey" PRIMARY KEY ("id_type")
);

-- CreateTable
CREATE TABLE "banks" (
    "id_bank" SERIAL NOT NULL,
    "name" VARCHAR(30) NOT NULL,

    CONSTRAINT "banks_pkey" PRIMARY KEY ("id_bank")
);

-- CreateTable
CREATE TABLE "shipment_payments" (
    "id_payment" SERIAL NOT NULL,
    "id_shipment" INTEGER NOT NULL,
    "id_bank" INTEGER NOT NULL,
    "id_receipt_type" INTEGER NOT NULL,
    "payment_date" DATE NOT NULL,
    "payment_amount" DECIMAL(14,2) NOT NULL,
    "description" TEXT,
    "is_credit_note" BOOLEAN NOT NULL DEFAULT false,
    "payment_receipt_number" VARCHAR(20) NOT NULL DEFAULT '-',
    "operation_number" VARCHAR(30) NOT NULL DEFAULT '-',
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shipment_payments_pkey" PRIMARY KEY ("id_payment")
);

-- CreateIndex
CREATE INDEX "shipment_payments_id_shipment_idx" ON "shipment_payments"("id_shipment");

-- CreateIndex
CREATE INDEX "shipment_payments_id_bank_idx" ON "shipment_payments"("id_bank");

-- CreateIndex
CREATE INDEX "shipment_payments_id_receipt_type_idx" ON "shipment_payments"("id_receipt_type");

-- AddForeignKey
ALTER TABLE "shipment_payments" ADD CONSTRAINT "shipment_payments_id_shipment_fkey" FOREIGN KEY ("id_shipment") REFERENCES "PurchaseShipment"("id_shipment") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipment_payments" ADD CONSTRAINT "shipment_payments_id_bank_fkey" FOREIGN KEY ("id_bank") REFERENCES "banks"("id_bank") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipment_payments" ADD CONSTRAINT "shipment_payments_id_receipt_type_fkey" FOREIGN KEY ("id_receipt_type") REFERENCES "receipt_types"("id_type") ON DELETE RESTRICT ON UPDATE CASCADE;
