-- CreateTable
CREATE TABLE "Supplier" (
    "id_supplier" SERIAL NOT NULL,
    "id_entity" INTEGER,
    "ruc" VARCHAR(11) NOT NULL,
    "supplier_name" VARCHAR(255) NOT NULL,
    "legal_name" VARCHAR(255),
    "phone_number" VARCHAR(15) NOT NULL,
    "phone_number2" VARCHAR(15),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id_supplier")
);

-- CreateTable
CREATE TABLE "CostCenter" (
    "id_center" SERIAL NOT NULL,
    "id_father_center" INTEGER,
    "cost_center_name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CostCenter_pkey" PRIMARY KEY ("id_center")
);

-- CreateTable
CREATE TABLE "PurchaseRequest" (
    "id_request" SERIAL NOT NULL,
    "id_cost_center" INTEGER NOT NULL,
    "request_date" TIMESTAMP(3) NOT NULL,
    "item" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "quantity" DECIMAL(10,2) NOT NULL,
    "unit_of_measurement" VARCHAR(50) NOT NULL,
    "planned_cost" DECIMAL(12,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PurchaseRequest_pkey" PRIMARY KEY ("id_request")
);

-- CreateTable
CREATE TABLE "PurchaseOrder" (
    "id_order" SERIAL NOT NULL,
    "id_request" INTEGER NOT NULL,
    "id_supplier" INTEGER NOT NULL,
    "order_date" TIMESTAMP(3) NOT NULL,
    "total_amount" DECIMAL(12,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PurchaseOrder_pkey" PRIMARY KEY ("id_order")
);

-- CreateTable
CREATE TABLE "PurchaseShipment" (
    "id_shipment" SERIAL NOT NULL,
    "id_order" INTEGER NOT NULL,
    "shipment_date" TIMESTAMP(3) NOT NULL,
    "receipt_type" VARCHAR(50),
    "receipt_number" VARCHAR(50) NOT NULL,
    "payment_type" VARCHAR(50) NOT NULL,
    "payment_due_date" TIMESTAMP(3) NOT NULL,
    "payment_status" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PurchaseShipment_pkey" PRIMARY KEY ("id_shipment")
);

-- CreateTable
CREATE TABLE "ShipmentPayment" (
    "id_payment" SERIAL NOT NULL,
    "id_shipment" INTEGER NOT NULL,
    "payment_date" TIMESTAMP(3) NOT NULL,
    "payment_amount" DECIMAL(14,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShipmentPayment_pkey" PRIMARY KEY ("id_payment")
);

-- CreateIndex
CREATE INDEX "Supplier_id_entity_idx" ON "Supplier"("id_entity");

-- CreateIndex
CREATE INDEX "CostCenter_id_father_center_idx" ON "CostCenter"("id_father_center");

-- CreateIndex
CREATE INDEX "PurchaseRequest_id_cost_center_idx" ON "PurchaseRequest"("id_cost_center");

-- CreateIndex
CREATE INDEX "PurchaseOrder_id_request_idx" ON "PurchaseOrder"("id_request");

-- CreateIndex
CREATE INDEX "PurchaseOrder_id_supplier_idx" ON "PurchaseOrder"("id_supplier");

-- CreateIndex
CREATE UNIQUE INDEX "PurchaseShipment_receipt_number_key" ON "PurchaseShipment"("receipt_number");

-- CreateIndex
CREATE INDEX "PurchaseShipment_id_order_idx" ON "PurchaseShipment"("id_order");

-- CreateIndex
CREATE INDEX "ShipmentPayment_id_shipment_idx" ON "ShipmentPayment"("id_shipment");

-- AddForeignKey
ALTER TABLE "Supplier" ADD CONSTRAINT "Supplier_id_entity_fkey" FOREIGN KEY ("id_entity") REFERENCES "Entity"("id_entity") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CostCenter" ADD CONSTRAINT "CostCenter_id_father_center_fkey" FOREIGN KEY ("id_father_center") REFERENCES "CostCenter"("id_center") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseRequest" ADD CONSTRAINT "PurchaseRequest_id_cost_center_fkey" FOREIGN KEY ("id_cost_center") REFERENCES "CostCenter"("id_center") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_id_request_fkey" FOREIGN KEY ("id_request") REFERENCES "PurchaseRequest"("id_request") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_id_supplier_fkey" FOREIGN KEY ("id_supplier") REFERENCES "Supplier"("id_supplier") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseShipment" ADD CONSTRAINT "PurchaseShipment_id_order_fkey" FOREIGN KEY ("id_order") REFERENCES "PurchaseOrder"("id_order") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShipmentPayment" ADD CONSTRAINT "ShipmentPayment_id_shipment_fkey" FOREIGN KEY ("id_shipment") REFERENCES "PurchaseShipment"("id_shipment") ON DELETE RESTRICT ON UPDATE CASCADE;
