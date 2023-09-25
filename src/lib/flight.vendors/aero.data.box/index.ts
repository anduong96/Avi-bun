import { AeroDataBoxAircraft, AeroDataBoxFlight } from './types';

import { ENV } from '@app/env';
import { Singleton } from '@app/lib/singleton';
import { FlightQueryParam } from '@app/types/flight';
import ky from 'ky';
import moment from 'moment';

/**
 * @see https://doc.aerodatabox.com
 */
export class _AeroDataBox extends Singleton<_AeroDataBox>() {
  private readonly DATE_FORMAT = 'YYYY-MM-DD';
  private readonly client = ky.create({
    prefixUrl: 'https://aerodatabox.p.rapidapi.com',
    headers: {
      'X-RapidAPI-Key': ENV.AERO_DATABOX_API_KEY,
      'X-RapidAPI-Host': 'aerodatabox.p.rapidapi.com',
    },
  });

  /**
   * The function `getAircraft` retrieves aircraft data based on a given tail number.
   * @param {string} tailNumber - The `tailNumber` parameter is a string that represents the unique
   * identifier of an aircraft. It is typically a combination of letters and numbers that are painted
   * on the tail of the aircraft.
   * @returns The function `getAircraft` is returning the data of type `AeroDataBoxAircraft` from the
   * API response.
   */
  async getAircraft(tailNumber: string) {
    const route = `aircrafts/reg/${tailNumber}`;
    const request = await this.client.get(route, {
      searchParams: {
        withRegistrations: true,
        withImage: true,
      },
    });
    const response = await request.json<AeroDataBoxAircraft>();
    return response;
  }

  async getFlights(args: FlightQueryParam) {
    const flightNum = `${args.airlineIata}${args.flightNumber}`;
    const { flightYear, flightMonth, flightDate } = args;
    const departureDate = moment({
      year: flightYear,
      month: flightMonth,
      date: flightDate,
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
    return response;
  }
}

export const AeroDataBox = _AeroDataBox.instance;
