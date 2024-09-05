-- CreateTable
CREATE TABLE "Entity" (
    "id_entity" SERIAL NOT NULL,
    "document_type" INTEGER NOT NULL DEFAULT 1,
    "document_number" VARCHAR(11) NOT NULL,
    "person_type" INTEGER NOT NULL DEFAULT 1,
    "last_name" VARCHAR(200) NOT NULL,
    "first_name" VARCHAR(200) NOT NULL,
    "address" VARCHAR(200),
    "phone_number" VARCHAR(15),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Entity_pkey" PRIMARY KEY ("id_entity")
);

-- CreateTable
CREATE TABLE "Channel" (
    "id_channel" SERIAL NOT NULL,
    "channel_name" VARCHAR(200) NOT NULL,
    "channel_type" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("id_channel")
);

-- CreateTable
CREATE TABLE "Client" (
    "id_client" SERIAL NOT NULL,
    "id_entity" INTEGER,
    "id_channel" INTEGER NOT NULL,
    "document_type" INTEGER NOT NULL DEFAULT 1,
    "document_number" VARCHAR(11) NOT NULL,
    "person_type" INTEGER NOT NULL DEFAULT 1,
    "last_name" VARCHAR(200) NOT NULL,
    "first_name" VARCHAR(200),
    "phone_number" VARCHAR(15),
    "phone_number2" VARCHAR(15),
    "zone" VARCHAR(200),
    "address" VARCHAR(200),
    "province" VARCHAR(200),
    "district" VARCHAR(200),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id_client")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id_employee" SERIAL NOT NULL,
    "id_entity" INTEGER,
    "id_channel" INTEGER NOT NULL,
    "document_type" INTEGER NOT NULL DEFAULT 1,
    "document_number" VARCHAR(11) NOT NULL,
    "last_name" VARCHAR(200) NOT NULL,
    "first_name" VARCHAR(200),
    "phone_number" VARCHAR(15),
    "phone_number2" VARCHAR(15),
    "address" VARCHAR(200),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id_employee")
);

-- CreateTable
CREATE TABLE "Sale" (
    "id_sale" SERIAL NOT NULL,
    "id_employee" INTEGER NOT NULL,
    "id_client" INTEGER NOT NULL,
    "receipt_type" VARCHAR(50),
    "receipt_number" VARCHAR(50) NOT NULL,
    "receipt_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total_amount" DECIMAL(14,2) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sale_pkey" PRIMARY KEY ("id_sale")
);

-- CreateTable
CREATE TABLE "SalePayment" (
    "id_payment" SERIAL NOT NULL,
    "id_sale" INTEGER NOT NULL,
    "id_employee" INTEGER NOT NULL,
    "payment_registration_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "payment_amount" DECIMAL(14,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SalePayment_pkey" PRIMARY KEY ("id_payment")
);

-- CreateIndex
CREATE INDEX "Client_id_channel_idx" ON "Client"("id_channel");

-- CreateIndex
CREATE INDEX "Client_id_entity_idx" ON "Client"("id_entity");

-- CreateIndex
CREATE INDEX "Employee_id_channel_idx" ON "Employee"("id_channel");

-- CreateIndex
CREATE INDEX "Employee_id_entity_idx" ON "Employee"("id_entity");

-- CreateIndex
CREATE UNIQUE INDEX "Sale_receipt_number_key" ON "Sale"("receipt_number");

-- CreateIndex
CREATE INDEX "Sale_id_employee_idx" ON "Sale"("id_employee");

-- CreateIndex
CREATE INDEX "Sale_id_client_idx" ON "Sale"("id_client");

-- CreateIndex
CREATE INDEX "SalePayment_id_sale_idx" ON "SalePayment"("id_sale");

-- CreateIndex
CREATE INDEX "SalePayment_id_employee_idx" ON "SalePayment"("id_employee");

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_id_entity_fkey" FOREIGN KEY ("id_entity") REFERENCES "Entity"("id_entity") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_id_channel_fkey" FOREIGN KEY ("id_channel") REFERENCES "Channel"("id_channel") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_id_entity_fkey" FOREIGN KEY ("id_entity") REFERENCES "Entity"("id_entity") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_id_channel_fkey" FOREIGN KEY ("id_channel") REFERENCES "Channel"("id_channel") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_id_employee_fkey" FOREIGN KEY ("id_employee") REFERENCES "Employee"("id_employee") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "Client"("id_client") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalePayment" ADD CONSTRAINT "SalePayment_id_sale_fkey" FOREIGN KEY ("id_sale") REFERENCES "Sale"("id_sale") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalePayment" ADD CONSTRAINT "SalePayment_id_employee_fkey" FOREIGN KEY ("id_employee") REFERENCES "Employee"("id_employee") ON DELETE RESTRICT ON UPDATE CASCADE;
