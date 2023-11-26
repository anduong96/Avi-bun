import ky from 'ky';
import moment from 'moment';
import { format } from 'sys';
import * as Cheerio from 'cheerio';

import { Logger } from '@app/lib/logger';

import { RadarBoxCrawlData } from './types';

export class RadarBox {
  private static BASE_URL = 'https://www.radarbox.com';
  private static DATE_FORMAT = 'dddd, MMMM D, YYYY HH:mm';
  private static client = ky.create({ prefixUrl: this.BASE_URL });
  private static readonly logger = Logger.getSubLogger({
    name: this.name,
  });

  static crawlAircraftHtml(html: string): RadarBoxCrawlData {
    const $ = Cheerio.load(html);
    // Find the script tag containing "window.init" and get its contents
    const initScript = $('script:contains("window.init")').html();
    if (!initScript) {
      this.logger.warn('No script tag containing "window.init" found\n%o', {
        html,
      });

      throw new Error('No script tag containing "window.init" found');
    }
    // Use regular expressions to extract the value of "current" from the script
    const dataStr = initScript.replace('window.init(', '').slice(0, -1);
    const data = JSON.parse(dataStr) as RadarBoxCrawlData;
    return data;
  }

  public static async getAircraft(tailNumber: string) {
    const request = await this.client.get(`data/registration/${tailNumber}`);
    const html = await request.text();
    const data = this.crawlAircraftHtml(html);
    this.logger.debug(
      'RadarBox request[%s] status[%s]',
      request.url,
      request.statusText,
    );

    if (!data.current.firstlalot) {
      this.logger.debug('Position not found for tailNumber[%s]', tailNumber);

      return {
        altitude: null,
        destinationIata: null,
        flightDate: null,
        flightNumberIata: null,
        latitude: null,
        longitude: null,
        originIata: null,
        updatedAt: null,
      };
    }

    const departureDate = moment(
      format('%s %s', data.current.depdate_utc, data.current.deps_utc),
      this.DATE_FORMAT,
    );

    const updatedAtMoment = moment(data.current.lastlalot);
    const updatedAt = updatedAtMoment.toDate();
    const flightDate = departureDate.toDate();
    const originIata = data.current.aporgia;
    const destinationIata = data.current.apdstia;
    const longitude = data.current.lastlo;
    const latitude = data.current.lastla;
    const altitude = data.current.alt;
    const flightNumber = data.current.fnic.replace(data.current.csalic, '');
    const airlineIata = data.current.csalic;
    this.logger.debug('RadarBox plane position', data.current);

    return {
      airlineIata,
      altitude,
      destinationIata,
      flightDate,
      flightNumber,
      latitude,
      longitude,
      originIata,
      updatedAt,
    };
  }
}
