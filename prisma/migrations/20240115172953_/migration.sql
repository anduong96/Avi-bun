/*
  Warnings:

  - A unique constraint covering the columns `[aircraftTailNumber,name]` on the table `AircraftSeatMeta` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `AircraftSeatMeta_aircraftTailNumber_name_key` ON `AircraftSeatMeta`(`aircraftTailNumber`, `name`);
