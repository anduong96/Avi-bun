/*
  Warnings:

  - You are about to drop the column `co2EmissionKgEconnomy` on the `Flight` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Flight" DROP COLUMN "co2EmissionKgEconnomy",
ADD COLUMN     "co2EmissionKgEconomy" DOUBLE PRECISION;
