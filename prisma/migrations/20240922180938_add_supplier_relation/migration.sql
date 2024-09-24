/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "id_user" SERIAL NOT NULL,
    "user_name" VARCHAR(255) NOT NULL,
    "user_password" VARCHAR(255) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_profile" INTEGER NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id_user")
);

-- CreateTable
CREATE TABLE "bank_transaction" (
    "id_transaction" SERIAL NOT NULL,
    "transaction_date" DATE NOT NULL,
    "id_user_delivery" INTEGER NOT NULL,
    "id_user_receive" INTEGER NOT NULL,
    "receipt_type" VARCHAR(50),
    "receipt_number" VARCHAR(50) NOT NULL,
    "total_amount" DECIMAL(10,2) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bank_transaction_pkey" PRIMARY KEY ("id_transaction")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id_profile" SERIAL NOT NULL,
    "profile" VARCHAR(255) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id_profile")
);

-- CreateIndex
CREATE UNIQUE INDEX "bank_transaction_receipt_number_key" ON "bank_transaction"("receipt_number");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_id_profile_fkey" FOREIGN KEY ("id_profile") REFERENCES "profiles"("id_profile") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_transaction" ADD CONSTRAINT "bank_transaction_id_user_delivery_fkey" FOREIGN KEY ("id_user_delivery") REFERENCES "users"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_transaction" ADD CONSTRAINT "bank_transaction_id_user_receive_fkey" FOREIGN KEY ("id_user_receive") REFERENCES "users"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;
