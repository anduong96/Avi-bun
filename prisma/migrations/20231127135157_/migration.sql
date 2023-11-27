/*
  Warnings:

  - You are about to alter the column `flightYear` on the `AircraftPosition` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `SmallInt`.
  - You are about to alter the column `flightMonth` on the `AircraftPosition` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `SmallInt`.
  - You are about to alter the column `flightDate` on the `AircraftPosition` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `SmallInt`.

*/
-- AlterTable
ALTER TABLE "AircraftPosition" ALTER COLUMN "flightYear" SET DATA TYPE SMALLINT,
ALTER COLUMN "flightMonth" SET DATA TYPE SMALLINT,
ALTER COLUMN "flightDate" SET DATA TYPE SMALLINT;
