/*
  Warnings:

  - You are about to drop the column `changedValue` on the `FlightEvent` table. All the data in the column will be lost.
  - You are about to drop the column `changedValueType` on the `FlightEvent` table. All the data in the column will be lost.
  - You are about to drop the column `prevValue` on the `FlightEvent` table. All the data in the column will be lost.
  - You are about to drop the column `prevValueType` on the `FlightEvent` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ChangeType" AS ENUM ('ADDED', 'REMOVED', 'MODIFIED');

-- AlterTable
ALTER TABLE "FlightEvent" DROP COLUMN "changedValue",
DROP COLUMN "changedValueType",
DROP COLUMN "prevValue",
DROP COLUMN "prevValueType",
ADD COLUMN     "changeType" "ChangeType",
ADD COLUMN     "currentValue" JSONB,
ADD COLUMN     "previousValue" JSONB,
ADD COLUMN     "valueType" "ValueType",
ALTER COLUMN "index" SET DEFAULT 0;

-- CreateTable
CREATE TABLE "JsonCache" (
    "id" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JsonCache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "JsonCache_expiresAt_idx" ON "JsonCache"("expiresAt");

-- AddForeignKey
ALTER TABLE "Flight" ADD CONSTRAINT "Flight_originIata_fkey" FOREIGN KEY ("originIata") REFERENCES "Airport"("iata") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flight" ADD CONSTRAINT "Flight_destinationIata_fkey" FOREIGN KEY ("destinationIata") REFERENCES "Airport"("iata") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flight" ADD CONSTRAINT "Flight_airlineIata_fkey" FOREIGN KEY ("airlineIata") REFERENCES "Airline"("iata") ON DELETE RESTRICT ON UPDATE CASCADE;
