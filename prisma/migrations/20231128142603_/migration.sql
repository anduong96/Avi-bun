-- AddForeignKey
ALTER TABLE "AirportWeather" ADD CONSTRAINT "AirportWeather_airportIata_fkey" FOREIGN KEY ("airportIata") REFERENCES "Airport"("iata") ON DELETE CASCADE ON UPDATE CASCADE;
