import { OpenSky_Aircraft, OpenSky_AircraftPosition } from './types';

import { Singleton } from '@app/lib/singleton';
import axios from 'axios';
import moment from 'moment';

export class OpenSky extends Singleton<OpenSky>() {
  private readonly client = axios.create({
    baseURL: 'https://opensky-network.org',
  });

  /**
   * @see {@link https://opensky-network.org/api/metadata/aircraft/icao/AC79C7}
   *
   * The function `getAircraft` retrieves aircraft metadata from an API using the provided aircraft
   * ICAO code.
   * @param {string} aircraftIcao - The `aircraftIcao` parameter is a string that represents the
   * International Civil Aviation Organization (ICAO) code of an aircraft. The ICAO code is a unique
   * identifier assigned to each aircraft by the International Civil Aviation Organization.
   * @returns the data of type `OpenSky_Aircraft` from the API response.
   */
  async getAircraft(aircraftIcao: string) {
    const route = `/api/metadata/aircraft/icao/${aircraftIcao}`;
    const response = await this.client.get<OpenSky_Aircraft>(route);
    return response.data;
  }

  /**
   * @see {@link https://opensky-network.org/api/tracks/?icao24=abfe1c&time=1694277455}
   *
   * The function `getAircraftPosition` retrieves the current position of an aircraft using its ICAO
   * code.
   * @param {string} aircraftIcao - The `aircraftIcao` parameter is a string that represents the ICAO24
   * address of an aircraft. The ICAO24 address is a unique identifier assigned to each aircraft and is
   * used for tracking purposes.
   * @returns The function `getAircraftPosition` returns an object with the following properties:
   * - `latitude`: the latitude of the aircraft's current position
   * - `longitude`: the longitude of the aircraft's current position
   * - `altitude`: the altitude of the aircraft's current position
   * - `isGrounded`: a boolean indicating whether the aircraft is currently on the ground
   * - `timestamp`: a Date object
   */
  async getAircraftRecentPositions(aircraftIcao: string) {
    const route = `/tracks`;
    const response = await this.client.get<OpenSky_AircraftPosition>(route, {
      params: {
        icao24: aircraftIcao,
        time: new Date().valueOf(),
      },
    });

    const data = response.data;
    return {
      positions: data.path.map(position => {
        const [ts, latitude, longitude, altitude, , isGrounded] = position;
        return {
          latitude,
          longitude,
          altitude,
          isGrounded,
          timestamp: moment(ts).toDate(),
        };
      }),
    };
  }
}
