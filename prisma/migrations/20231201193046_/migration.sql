/*
  Warnings:

  - Added the required column `vendor` to the `AirportWeather` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AirportWeather" ADD COLUMN     "vendor" TEXT NOT NULL;
