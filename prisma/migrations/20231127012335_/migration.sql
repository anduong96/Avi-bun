/*
  Warnings:

  - You are about to drop the column `temperatureCelsius` on the `AirportWeather` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[airportIata,year,month,date]` on the table `AirportWeather` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `airTemperatureCelsius` to the `AirportWeather` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `AirportWeather` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hour` to the `AirportWeather` table without a default value. This is not possible if the table is not empty.
  - Added the required column `month` to the `AirportWeather` table without a default value. This is not possible if the table is not empty.
  - Added the required column `precipitationAmountMilimeter` to the `AirportWeather` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `AirportWeather` table without a default value. This is not possible if the table is not empty.
  - Added the required column `windFromDeirectionDegrees` to the `AirportWeather` table without a default value. This is not possible if the table is not empty.
  - Added the required column `windSpeedMeterPerSecond` to the `AirportWeather` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `AirportWeather` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AirportWeather" DROP COLUMN "temperatureCelsius",
ADD COLUMN     "airTemperatureCelsius" INTEGER NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "date" INTEGER NOT NULL,
ADD COLUMN     "hour" INTEGER NOT NULL,
ADD COLUMN     "month" INTEGER NOT NULL,
ADD COLUMN     "precipitationAmountMilimeter" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "windFromDeirectionDegrees" INTEGER NOT NULL,
ADD COLUMN     "windSpeedMeterPerSecond" INTEGER NOT NULL,
ADD COLUMN     "year" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AirportWeather_airportIata_year_month_date_key" ON "AirportWeather"("airportIata", "year", "month", "date");
