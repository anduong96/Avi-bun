-- DropForeignKey
ALTER TABLE "Flight" DROP CONSTRAINT "Flight_destinationIata_fkey";

-- DropForeignKey
ALTER TABLE "Flight" DROP CONSTRAINT "Flight_originIata_fkey";

-- AddForeignKey
ALTER TABLE "Flight" ADD CONSTRAINT "Flight_originIata_fkey" FOREIGN KEY ("originIata") REFERENCES "Airport"("iata") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flight" ADD CONSTRAINT "Flight_destinationIata_fkey" FOREIGN KEY ("destinationIata") REFERENCES "Airport"("iata") ON DELETE NO ACTION ON UPDATE CASCADE;
