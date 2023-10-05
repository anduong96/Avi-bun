/*
  Warnings:

  - You are about to drop the `FlightPosition` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FlightPosition" DROP CONSTRAINT "FlightPosition_flightID_fkey";

-- DropTable
DROP TABLE "FlightPosition";
