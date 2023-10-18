import ky from 'ky';
import moment from 'moment';

import { ENV } from '@app/env';
import { Logger } from '@app/lib/logger';
import { FlightQueryParam } from '@app/types/flight';

import { AeroDataBoxAircraft, AeroDataBoxFlight } from './types';

/**
 * @see https://doc.aerodatabox.com
 */
export class AeroDataBox {
  private static readonly DATE_FORMAT = 'YYYY-MM-DD';
  private static readonly client = ky.create({
    headers: {
      'X-RapidAPI-Host': 'aerodatabox.p.rapidapi.com',
      'X-RapidAPI-Key': ENV.AERO_DATABOX_API_KEY,
    },
    prefixUrl: 'https://aerodatabox.p.rapidapi.com',
  });
  private static readonly logger = Logger.getSubLogger({
    name: this.name,
  });

  /**
   * The function `getAircraft` retrieves aircraft data based on a given tail number.
   * @param {string} tailNumber - The `tailNumber` parameter is a string that represents the unique
   * identifier of an aircraft. It is typically a combination of letters and numbers that are painted
   * on the tail of the aircraft.
   * @returns The function `getAircraft` is returning the data of type `AeroDataBoxAircraft` from the
   * API response.
   */
  static async getAircraft(tailNumber: string) {
    const route = `aircrafts/reg/${tailNumber}`;
    const request = await this.client.get(route, {
      searchParams: {
        withImage: true,
        withRegistrations: true,
      },
    });
    const response = await request.json<AeroDataBoxAircraft>();
    return response;
  }

  static async getFlights(args: FlightQueryParam) {
    const flightNum = `${args.airlineIata}${args.flightNumber}`;
    const { flightDate, flightMonth, flightYear } = args;
    const departureDate = moment({
      date: flightDate,
      month: flightMonth,
      year: flightYear,
    });
    const dateStr = departureDate.format(this.DATE_FORMAT);
    const route = `flights/number/${flightNum}/${dateStr}`;
    const request = await this.client.get(route);
    this.logger.debug(
      'Getting flights from route[%s] status[%s]',
      request.url,
      request.status,
    );
    const response = await request.json<AeroDataBoxFlight[]>();
    this.logger.debug('Result\n%o', response);
    return response;
  }
}
