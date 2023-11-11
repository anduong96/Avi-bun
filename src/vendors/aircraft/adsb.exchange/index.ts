import ky from 'ky';
import moment from 'moment';
import { toLower } from 'lodash';

import { ADSB_AircraftTrace } from './types';

/**
 * Does not work right now because missing `/traces/{plane_id?}`
 * 42 is not the correct id
 */
export class AdsbExchange {
  static async getAircraftFullPositions(aircraftIcao: string) {
    const route = `/data/traces/42/trace_full_${toLower(aircraftIcao)}.json`;
    const request = await this.getClient(aircraftIcao).get(route);
    const response = await request.json<ADSB_AircraftTrace>();
    return this.formatTraceResult(response);
  }

  static async getAircraftRecentPositions(aircraftIcao: string) {
    const route = `/data/traces/42/trace_recent_${toLower(aircraftIcao)}.json`;
    const request = await this.getClient(aircraftIcao).get(route);
    const response = await request.json<ADSB_AircraftTrace>();
    return this.formatTraceResult(response);
  }

  private static formatTraceResult(result: ADSB_AircraftTrace) {
    const timestamp = moment(result.timestamp);

    return {
      positions: result.trace.map(entry => {
        const [
          secAfterTs,
          lat,
          lon,
          alt,
          groundSpeed,
          trackDeg,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          _flags,
          verticalRate,
          // extra,
          // source,
        ] = entry;

        return {
          altitude: typeof alt === 'number' ? alt : 0,
          groundSpeed,
          latitude: lat,
          longitude: lon,
          trackDeg,
          ts: timestamp.clone().add({ seconds: secAfterTs }).toDate(),
          verticalRate,
        };
      }),
      timestamp: timestamp.toDate(),
    };
  }

  private static getClient(aircraftIcao: string) {
    return ky.create({
      headers: {
        Referer: `https://globe.adsbexchange.com/?icao=${aircraftIcao}`,
      },
      prefixUrl: 'https://globe.adsbexchange.com',
    });
  }
}
