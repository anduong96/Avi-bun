/*
  Warnings:

  - Added the required column `iconURL` to the `AirportWeather` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `AirportWeather` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AirportWeather" ADD COLUMN     "iconURL" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL;
