-- DropForeignKey
ALTER TABLE "AircraftPosition" DROP CONSTRAINT "AircraftPosition_aircraftID_fkey";

-- DropForeignKey
ALTER TABLE "Flight" DROP CONSTRAINT "Flight_aircraftTailnumber_fkey";

-- DropForeignKey
ALTER TABLE "Flight" DROP CONSTRAINT "Flight_airlineIata_fkey";

-- DropForeignKey
ALTER TABLE "Flight" DROP CONSTRAINT "Flight_destinationIata_fkey";

-- DropForeignKey
ALTER TABLE "Flight" DROP CONSTRAINT "Flight_originIata_fkey";

-- DropForeignKey
ALTER TABLE "FlightVendorConnection" DROP CONSTRAINT "FlightVendorConnection_flightID_fkey";

-- DropForeignKey
ALTER TABLE "UserFlight" DROP CONSTRAINT "UserFlight_flightID_fkey";

-- AddForeignKey
ALTER TABLE "Flight" ADD CONSTRAINT "Flight_originIata_fkey" FOREIGN KEY ("originIata") REFERENCES "Airport"("iata") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Flight" ADD CONSTRAINT "Flight_destinationIata_fkey" FOREIGN KEY ("destinationIata") REFERENCES "Airport"("iata") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Flight" ADD CONSTRAINT "Flight_airlineIata_fkey" FOREIGN KEY ("airlineIata") REFERENCES "Airline"("iata") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Flight" ADD CONSTRAINT "Flight_aircraftTailnumber_fkey" FOREIGN KEY ("aircraftTailnumber") REFERENCES "Aircraft"("tailNumber") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "FlightVendorConnection" ADD CONSTRAINT "FlightVendorConnection_flightID_fkey" FOREIGN KEY ("flightID") REFERENCES "Flight"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "AircraftPosition" ADD CONSTRAINT "AircraftPosition_aircraftID_fkey" FOREIGN KEY ("aircraftID") REFERENCES "Aircraft"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "UserFlight" ADD CONSTRAINT "UserFlight_flightID_fkey" FOREIGN KEY ("flightID") REFERENCES "Flight"("id") ON DELETE CASCADE ON UPDATE RESTRICT;
