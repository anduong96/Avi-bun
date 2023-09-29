import { Logger } from '@app/lib/logger';
import assert from 'assert';
import * as Cheerio from 'cheerio';
import ky from 'ky';
import { isEmpty } from 'lodash';
import { RadarBoxCrawlData } from './types';
import moment from 'moment';
import { isMsOrSeconds } from '@app/lib/validators/is.ms.or.sec';

export class RadarBox {
  private static readonly logger = Logger.getSubLogger({
    name: this.name,
  });
  private static client = ky.create({
    prefixUrl: 'https://www.radarbox.com',
  });

  static crawlAircraftHtml(html: string): RadarBoxCrawlData {
    const $ = Cheerio.load(html);
    // Find the script tag containing "window.init" and get its contents
    const initScript = $('script:contains("window.init")').html();
    assert(initScript, 'No script tag containing "window.init" found');
    // Use regular expressions to extract the value of "current" from the script
    const dataStr = initScript.replace('window.init(', '').slice(0, -1);
    const data = JSON.parse(dataStr) as RadarBoxCrawlData;
    return data;
  }

  public static async getAircraft(tailNumber: string) {
    const request = await this.client.get(`data/registration/${tailNumber}`);
    const html = await request.text();
    const data = this.crawlAircraftHtml(html);
    let lastPositionTs = data.current.lastlalot;
    let lastLongitude = data.current.lastlo;
    let lastLatitude = data.current.lastla;
    let updatedAt = data.current.lastlalot;
    let flightNumberIata = data.current.fnia;
    let altitude = null;

    if (!isEmpty(data.route)) {
      const timestamps = Object.keys(data.route);
      const latestTs = timestamps[timestamps.length - 1];
      const latest = data.route[latestTs];
      const isSeconds = isMsOrSeconds(Number(latestTs)) == 'seconds';
      lastLatitude = latest[0];
      lastLongitude = latest[1];
      lastPositionTs = Number(latestTs) * (isSeconds ? 1000 : 1);
      altitude = typeof latest[2] === 'number' ? latest[2] : null;
    }

    if (!lastPositionTs) {
      lastPositionTs = data.current.lastFlight.lastlalot;
      lastLongitude = data.current.lastFlight.lastlo;
      lastLatitude = data.current.lastFlight.lastla;
      flightNumberIata = data.current.lastFlight.fnia;
      updatedAt = data.current.lastFlight.lastlalot;
    }

    const timestamp = moment(lastPositionTs).toDate();
    const longitude = lastLongitude;
    const latitude = lastLatitude;
    const updatedAtDate = moment(updatedAt).toDate();

    this.logger.debug('`RadarBox.getAircraft`', {
      tailNumber,
      timestamp,
      longitude,
      latitude,
      altitude,
    });

    return {
      timestamp,
      longitude,
      latitude,
      altitude,
      flightNumberIata,
      updatedAt: updatedAtDate,
      raw: data,
    };
  }
}
