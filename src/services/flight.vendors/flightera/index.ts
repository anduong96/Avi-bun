import { Singleton } from '@app/lib/singleton';
import axios from 'axios';
import { getAircraftFromHtml } from './plane.crawl';

export class Flightera extends Singleton<Flightera>() {
  private readonly client = axios.create({
    baseURL: 'https://www.flightera.net',
    // headers: {
    //   Authorization: 'oABrVZsnrsSuzytYgxIwkRLWprgkIHSSi',
    // },
  });

  /**
   * // TODO: Not working due to rotating auth on their site
   * @param aircraftIcao
   */
  async getAircraftPostion(aircraftIcao: string) {
    type Response = [
      'BA179',
      '406A34',
      'BAW19J',
      'G-STBI',
      'EGLL',
      'London',
      'GB',
      'KJFK',
      'New York',
      'US',
      226293161,
      '18:54',
      '21:04',
      51.4775,
      -0.4614,
      40.6397,
      -73.7789,
      true,
      '//www.flightera.net/staticfiles/acftpic_9768352.jpg',
      '+0',
      '+0',
      'British Airways',
      'B777-300ER',
      Array<number[]>,
    ];

    const route = `/en/live/track_hex/${aircraftIcao}`;
    const response = await this.client.get<Response>(route);
    return response.data;
  }

  /**
   * The function `getAircraftFromCrawl` retrieves aircraft information from a website using a tail
   * number and returns the parsed data.
   * @param {string} tailNumber - The `tailNumber` parameter is a string that represents the unique
   * identifier of an aircraft. It is typically the alphanumeric code painted on the tail of the
   * aircraft, which helps identify and track the specific aircraft.
   * @returns the result of calling the `getAircraftFromHtml` function with the `response` as an
   * argument.
   */
  async getAircraftFromCrawl(tailNumber: string) {
    const response = await this.client.get<string>(`/en/planes/${tailNumber}`);
    return getAircraftFromHtml(response.data);
  }
}
