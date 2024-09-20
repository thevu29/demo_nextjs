/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `invoices` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[customer_id]` on the table `invoices` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `image_url` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customer_id` to the `invoices` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "invoices_customerId_key";

-- AlterTable
ALTER TABLE "customers" DROP COLUMN "imageUrl",
ADD COLUMN     "image_url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "invoices" DROP COLUMN "customerId",
ADD COLUMN     "customer_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "invoices_customer_id_key" ON "invoices"("customer_id");
