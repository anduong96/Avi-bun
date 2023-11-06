/*
  Warnings:

  - You are about to drop the column `tempuratureC` on the `AirportWeather` table. All the data in the column will be lost.
  - Added the required column `temperatureCelsius` to the `AirportWeather` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Flight` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AirportWeather" DROP COLUMN "tempuratureC",
ADD COLUMN     "temperatureCelsius" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Flight" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;