-- AlterTable
ALTER TABLE "PurchaseOrder" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "PurchaseRequest" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "is_approved" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "PurchaseShipment" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;
