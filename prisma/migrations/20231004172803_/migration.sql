/*
  Warnings:

  - A unique constraint covering the columns `[updatedAt]` on the table `AircraftPosition` will be added. If there are existing duplicate values, this will fail.
  - Made the column `icao` on table `Aircraft` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `airlineIata` to the `AircraftPosition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `destinationIata` to the `AircraftPosition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `flightDate` to the `AircraftPosition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `flightMonth` to the `AircraftPosition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `flightNumber` to the `AircraftPosition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `flightYear` to the `AircraftPosition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originIata` to the `AircraftPosition` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "AircraftPosition_aircraftID_key";

-- AlterTable
ALTER TABLE "Aircraft" ALTER COLUMN "icao" SET NOT NULL;

-- AlterTable
ALTER TABLE "AircraftPosition" ADD COLUMN     "airlineIata" TEXT NOT NULL,
ADD COLUMN     "altitude" INTEGER,
ADD COLUMN     "destinationIata" TEXT NOT NULL,
ADD COLUMN     "flightDate" INTEGER NOT NULL,
ADD COLUMN     "flightMonth" INTEGER NOT NULL,
ADD COLUMN     "flightNumber" TEXT NOT NULL,
ADD COLUMN     "flightYear" INTEGER NOT NULL,
ADD COLUMN     "originIata" TEXT NOT NULL,
ALTER COLUMN "latitude" DROP NOT NULL,
ALTER COLUMN "longitude" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "AircraftPosition_aircraftID_idx" ON "AircraftPosition"("aircraftID");

-- CreateIndex
CREATE UNIQUE INDEX "AircraftPosition_updatedAt_key" ON "AircraftPosition"("updatedAt");
