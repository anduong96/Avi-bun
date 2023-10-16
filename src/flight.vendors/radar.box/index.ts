import ky from 'ky';
import moment from 'moment';
import * as Cheerio from 'cheerio';

import { Logger } from '@app/lib/logger';

import { RadarBoxCrawlData } from './types';

export class RadarBox {
  private static DATE_FORMAT = 'dddd, MMMM D, YYYY';
  private static client = ky.create({
    prefixUrl: 'https://www.radarbox.com',
  });
  private static readonly logger = Logger.getSubLogger({
    name: this.name,
  });

  static crawlAircraftHtml(html: string): RadarBoxCrawlData {
    const $ = Cheerio.load(html);
    // Find the script tag containing "window.init" and get its contents
    const initScript = $('script:contains("window.init")').html();
    if (!initScript) {
      this.logger.warn(
        'No script tag containing "window.init" found\n%s',
        html,
      );

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
    if (!data.current.firstlalot) {
      return null;
    }

    const flightDateMoment = moment(data.current.depdate, this.DATE_FORMAT);
    const updatedAtMoment = moment(data.current.lastlalot);
    const updatedAt = updatedAtMoment.toDate();
    const flightDate = flightDateMoment.toDate();
    const originIata = data.current.aporgia;
    const destinationIata = data.current.apdstia;
    const longitude = data.current.lastlo;
    const latitude = data.current.lastla;
    const altitude = data.current.alt;
    const flightNumberIata = data.current.fnia;

    return {
      altitude,
      destinationIata,
      flightDate,
      flightNumberIata,
      latitude,
      longitude,
      originIata,
      updatedAt,
    };
  }
}
