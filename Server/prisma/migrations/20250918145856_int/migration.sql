/*
  Warnings:

  - You are about to alter the column `budgetAmount` on the `Budget` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `amount` on the `Transaction` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - A unique constraint covering the columns `[categoryName,userId]` on the table `Category` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Budget" ALTER COLUMN "budgetAmount" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "public"."Transaction" ALTER COLUMN "amount" SET DATA TYPE DOUBLE PRECISION;

-- CreateIndex
CREATE UNIQUE INDEX "Category_categoryName_userId_key" ON "public"."Category"("categoryName", "userId");
