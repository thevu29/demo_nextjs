/*
  Warnings:

  - You are about to drop the column `image_url` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `customer_id` on the `invoices` table. All the data in the column will be lost.
  - Added the required column `imageUrl` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerId` to the `invoices` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "invoices" DROP CONSTRAINT "invoices_customer_id_fkey";

-- AlterTable
ALTER TABLE "customers" DROP COLUMN "image_url",
ADD COLUMN     "imageUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "invoices" DROP COLUMN "customer_id",
ADD COLUMN     "customerId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
