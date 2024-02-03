/*
  Warnings:

  - A unique constraint covering the columns `[aircraftID,updatedAt]` on the table `AircraftPosition` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `AircraftPosition_updatedAt_key` ON `AircraftPosition`;

-- CreateIndex
CREATE UNIQUE INDEX `AircraftPosition_aircraftID_updatedAt_key` ON `AircraftPosition`(`aircraftID`, `updatedAt`);
