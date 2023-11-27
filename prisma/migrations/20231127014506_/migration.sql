/*
  Warnings:

  - You are about to drop the column `precipitationAmountMilimeter` on the `AirportWeather` table. All the data in the column will be lost.
  - Added the required column `precipitationAmountMillimeter` to the `AirportWeather` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AirportWeather" DROP COLUMN "precipitationAmountMilimeter",
ADD COLUMN     "precipitationAmountMillimeter" INTEGER NOT NULL;
