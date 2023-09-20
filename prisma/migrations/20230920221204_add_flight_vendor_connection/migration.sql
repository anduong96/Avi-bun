/*
  Warnings:

  - You are about to drop the column `name` on the `Aircraft` table. All the data in the column will be lost.
  - You are about to drop the column `aircraftIata` on the `Flight` table. All the data in the column will be lost.
  - You are about to drop the column `destinationTimezone` on the `Flight` table. All the data in the column will be lost.
  - You are about to drop the column `originTimezone` on the `Flight` table. All the data in the column will be lost.
  - You are about to drop the column `vendor` on the `Flight` table. All the data in the column will be lost.
  - You are about to drop the column `vendorResourceID` on the `Flight` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[airlineIata,flightNumber,originIata,destinationIata,departureDate]` on the table `Flight` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `model` to the `Aircraft` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "FlightVendor" ADD VALUE 'AERO_DATA_BOX';

-- DropIndex
DROP INDEX "Flight_vendor_vendorResourceID_key";

-- AlterTable
ALTER TABLE "Aircraft" DROP COLUMN "name",
ADD COLUMN     "model" TEXT NOT NULL,
ALTER COLUMN "iata" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Flight" DROP COLUMN "aircraftIata",
DROP COLUMN "destinationTimezone",
DROP COLUMN "originTimezone",
DROP COLUMN "vendor",
DROP COLUMN "vendorResourceID";

-- CreateTable
CREATE TABLE "FlightVendorConnection" (
    "id" SERIAL NOT NULL,
    "vendor" "FlightVendor" NOT NULL,
    "vendorResourceID" TEXT NOT NULL,
    "flightID" TEXT NOT NULL,

    CONSTRAINT "FlightVendorConnection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FlightVendorConnection_flightID_vendor_key" ON "FlightVendorConnection"("flightID", "vendor");

-- CreateIndex
CREATE UNIQUE INDEX "Flight_airlineIata_flightNumber_originIata_destinationIata__key" ON "Flight"("airlineIata", "flightNumber", "originIata", "destinationIata", "departureDate");

-- AddForeignKey
ALTER TABLE "FlightVendorConnection" ADD CONSTRAINT "FlightVendorConnection_flightID_fkey" FOREIGN KEY ("flightID") REFERENCES "Flight"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
