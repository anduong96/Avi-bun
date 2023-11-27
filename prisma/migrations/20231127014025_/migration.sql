/*
  Warnings:

  - A unique constraint covering the columns `[airportIata,year,month,date,hour]` on the table `AirportWeather` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "AirportWeather_airportIata_year_month_date_key";

-- CreateIndex
CREATE UNIQUE INDEX "AirportWeather_airportIata_year_month_date_hour_key" ON "AirportWeather"("airportIata", "year", "month", "date", "hour");
