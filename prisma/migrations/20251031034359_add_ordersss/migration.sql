/*
  Warnings:

  - You are about to drop the column `deliveryInfo` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "deliveryInfo";

-- CreateTable
CREATE TABLE "DeliveryInfo" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "orderId" INTEGER NOT NULL,

    CONSTRAINT "DeliveryInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DeliveryInfo_orderId_key" ON "DeliveryInfo"("orderId");

-- AddForeignKey
ALTER TABLE "DeliveryInfo" ADD CONSTRAINT "DeliveryInfo_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
