-- DropForeignKey
ALTER TABLE "Flight" DROP CONSTRAINT "Flight_airlineIata_fkey";

-- DropForeignKey
ALTER TABLE "Flight" DROP CONSTRAINT "Flight_destinationIata_fkey";

-- DropForeignKey
ALTER TABLE "Flight" DROP CONSTRAINT "Flight_originIata_fkey";
