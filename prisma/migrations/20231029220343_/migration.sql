/*
  Warnings:

  - A unique constraint covering the columns `[icao]` on the table `Airline` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Airline_icao_key" ON "Airline"("icao");
