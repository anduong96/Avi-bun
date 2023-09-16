import axios from 'axios';

export class SkybraryApiService {
  static readonly instance = new SkybraryApiService();

  private readonly client = axios.create({
    baseURL: 'https://skybrary.aero',
  });

  private get baseURL(): string {
    return this.client.defaults.baseURL!;
  }

  /**
   * @see {@link https://skybrary.aero/sites/default/files/A319_3D.jpg}
   * @see {@link https://skybrary.aero/sites/default/files/A319.jpg}
   * @description The function `get3dPhotoURL` returns a URL for a 3D photo of an aircraft based on its ICAO code.
   * @param {string} aircraftIcao - The `aircraftIcao` parameter is a string that represents the
   * International Civil Aviation Organization (ICAO) code of an aircraft.
   * @returns a URL string for a 3D photo of an aircraft, based on the provided aircraft ICAO code.
   */
  get3dPhotoURL(aircraftIcao: string) {
    return `${this.baseURL}/sites/default/files/${aircraftIcao}_3D.jpg`;
  }

  getPhotoURL(aircraftIcao: string) {
    return `${this.baseURL}/sites/default/files/${aircraftIcao}.jpg`;
  }
}
