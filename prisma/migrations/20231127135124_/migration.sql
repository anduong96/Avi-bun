/*
  Warnings:

  - You are about to alter the column `date` on the `AirportWeather` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `SmallInt`.
  - You are about to alter the column `hour` on the `AirportWeather` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `SmallInt`.
  - You are about to alter the column `month` on the `AirportWeather` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `SmallInt`.
  - You are about to alter the column `year` on the `AirportWeather` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `SmallInt`.
  - You are about to alter the column `flightYear` on the `Flight` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `SmallInt`.
  - You are about to alter the column `flightMonth` on the `Flight` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `SmallInt`.
  - You are about to alter the column `flightDate` on the `Flight` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `SmallInt`.

*/
-- AlterTable
ALTER TABLE "AirportWeather" ALTER COLUMN "date" SET DATA TYPE SMALLINT,
ALTER COLUMN "hour" SET DATA TYPE SMALLINT,
ALTER COLUMN "month" SET DATA TYPE SMALLINT,
ALTER COLUMN "year" SET DATA TYPE SMALLINT;

-- AlterTable
ALTER TABLE "Flight" ALTER COLUMN "flightYear" SET DATA TYPE SMALLINT,
ALTER COLUMN "flightMonth" SET DATA TYPE SMALLINT,
ALTER COLUMN "flightDate" SET DATA TYPE SMALLINT;
