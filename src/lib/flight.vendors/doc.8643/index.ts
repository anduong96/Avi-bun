import { Singleton } from '@app/lib/singleton';

export class Doc8643 extends Singleton<Doc8643>() {
  baseURL: string = 'https://doc8643.com';

  /**
   * The function `get3dPhotoURL` returns a URL for a 3D photo of an aircraft based on its ICAO code.
   * @param {string} aircraftIcao - The `aircraftIcao` parameter is a string that represents the
   * International Civil Aviation Organization (ICAO) code of an aircraft.
   * @returns a URL string for a 3D photo of an aircraft, based on the provided aircraft ICAO code.
   */
  get3dPhotoURL(aircraftIcao: string) {
    return `${this.baseURL}/static/img/aircraft/3D/${aircraftIcao}.jpg`;
  }

  /**
   * The function `getPhotoUrl` returns the URL of a photo for a given aircraft ICAO code.
   * @param {string} aircraftIcao - The `aircraftIcao` parameter is a string that represents the
   * International Civil Aviation Organization (ICAO) code of an aircraft.
   * @returns a URL string that is constructed using the `baseURL` and the `aircraftIcao` parameter. The
   * URL is formed by appending the `aircraftIcao` value to the `/static/img/aircraft/large/` path and
   * adding the `.jpg` extension.
   */
  getPhotoUrl(aircraftIcao: string) {
    return `${this.baseURL}/static/img/aircraft/large/${aircraftIcao}.jpg`;
  }
}
