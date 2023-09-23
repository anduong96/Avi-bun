import { toDateOrNull } from '@app/lib/date.or.null';
import { FlightStats } from '@app/lib/flight.vendors/flight.stats';
import { toFlightStatus } from '@app/lib/flight.vendors/flight.stats/utils';
import { prisma } from '@app/prisma';
import { FlightQueryParam } from '@app/types/flight';
import { Flight, FlightVendor } from '@prisma/client';
import { isEmpty } from 'lodash';

/**
 * The function `createFlightFromFlightStats` creates flights from flight data obtained from
 * FlightStats API.
 * @param {FlightQueryParam} param - The `param` parameter is an object that contains the following
 * properties:
 * @returns The function `createFlightFromFlightStats` returns a Promise that resolves to an array of
 * `Flight` objects.
 */
export async function createFlightFromFlightStats(
  param: FlightQueryParam,
): Promise<Flight[]> {
  const remoteFlights = await FlightStats.searchFlights({
    airlineIata: param.airlineIata,
    flightNumber: param.flightNumber,
    departureDate: param.departureDate,
  });

  if (isEmpty(remoteFlights)) {
    throw new Error('No flight(s) found');
  }

  const flights = await prisma.$transaction(async txn =>
    Promise.all(
      remoteFlights.map(async entry => {
        const details = await FlightStats.getFlightDetails({
          departureDate: entry.date,
          flightID: entry.flightID,
          flightNumber: param.flightNumber,
          airlineIata: param.airlineIata,
        });

        const info = details.additionalFlightInfo;
        const schedule = details.schedule;
        const aircraftTailnumber = info.equipment?.tailNumber;
        const {
          scheduledGateDepartureUTC,
          scheduledGateArrivalUTC,
          estimatedGateArrivalUTC,
          estimatedGateDepartureUTC,
          actualGateArrivalUTC,
          actualGateDepartureUTC,
        } = schedule;

        const scheduledGateDeparture = toDateOrNull(
          scheduledGateDepartureUTC || estimatedGateDepartureUTC,
        );
        const scheduledGateArrival = toDateOrNull(
          scheduledGateArrivalUTC || estimatedGateArrivalUTC,
        );
        const estimatedGateArrival = toDateOrNull(
          estimatedGateArrivalUTC || scheduledGateArrivalUTC,
        );
        const estimatedGateDeparture = toDateOrNull(
          estimatedGateDepartureUTC || scheduledGateDepartureUTC,
        );

        return await txn.flight.create({
          data: {
            FlightVendorConnection: {
              create: {
                vendor: FlightVendor.AERO_DATA_BOX,
                vendorResourceID: entry.flightID,
              },
            },
            flightNumber: param.flightNumber,
            airlineIata: param.airlineIata,
            departureDate: entry.date,
            aircraftTailnumber: aircraftTailnumber,
            originIata: details.departureAirport.iata,
            originTerminal: details.departureAirport.terminal,
            originGate: details.departureAirport.gate,
            destinationIata: details.arrivalAirport.iata,
            destinationTerminal: details.arrivalAirport.terminal,
            destinationGate: details.arrivalAirport.gate,
            status: toFlightStatus(details.status),
            scheduledGateDeparture: scheduledGateDeparture!,
            scheduledGateArrival: scheduledGateArrival!,
            estimatedGateArrival: estimatedGateArrival!,
            estimatedGateDeparture: estimatedGateDeparture!,
            actualGateArrival: toDateOrNull(actualGateArrivalUTC),
            actualGateDeparture: toDateOrNull(actualGateDepartureUTC),
          },
        });
      }),
    ),
  );

  return flights;
}
