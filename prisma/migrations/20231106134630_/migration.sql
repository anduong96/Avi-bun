/*
  Warnings:

  - You are about to drop the column `index` on the `FlightTimeline` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[flightID,timestamp]` on the table `FlightTimeline` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `FlightTimeline` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "FlightTimeline_flightID_index_key";

-- AlterTable
ALTER TABLE "FlightTimeline" DROP COLUMN "index",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "FlightTimeline_flightID_timestamp_key" ON "FlightTimeline"("flightID", "timestamp");
