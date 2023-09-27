import { Singleton } from '@app/lib/singleton';
import ky from 'ky';
import { toLower } from 'lodash';
import moment from 'moment';
import { ADSB_AircraftTrace } from './types';

/**
 * Does not work right now because missing `/traces/{plane_id?}`
 * 42 is not the correct id
 */
export class AdsbExchange extends Singleton<AdsbExchange>() {
  private getClient(aircraftIcao: string) {
    return ky.create({
      prefixUrl: 'https://globe.adsbexchange.com',
      headers: {
        Referer: `https://globe.adsbexchange.com/?icao=${aircraftIcao}`,
      },
    });
  }

  private formatTraceResult(result: ADSB_AircraftTrace) {
    const timestamp = moment(result.timestamp);

    return {
      timestamp: timestamp.toDate(),
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
          ts: timestamp.clone().add({ seconds: secAfterTs }).toDate(),
          latitude: lat,
          longitude: lon,
          altitude: typeof alt === 'number' ? alt : 0,
          trackDeg,
          groundSpeed,
          verticalRate,
        };
      }),
    };
  }

  async getAircraftRecentPositions(aircraftIcao: string) {
    const route = `/data/traces/42/trace_recent_${toLower(aircraftIcao)}.json`;
    const request = await this.getClient(aircraftIcao).get(route);
    const response = await request.json<ADSB_AircraftTrace>();
    return this.formatTraceResult(response);
  }

  async getAircraftFullPositions(aircraftIcao: string) {
    const route = `/data/traces/42/trace_full_${toLower(aircraftIcao)}.json`;
    const request = await this.getClient(aircraftIcao).get(route);
    const response = await request.json<ADSB_AircraftTrace>();
    return this.formatTraceResult(response);
  }
}
