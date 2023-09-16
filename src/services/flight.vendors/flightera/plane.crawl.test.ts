import * as Cheerio from 'cheerio';

import { beforeAll, describe, expect, test } from 'bun:test';
import {
  getAircraftFromHtml,
  getDescription,
  getIcao,
  getSeatConfiguration,
} from './plane.crawl';

import axios from 'axios';

describe('Flight Vendor: Flightera', () => {
  let $: Cheerio.CheerioAPI;
  let html: string;

  beforeAll(async () => {
    const route = 'https://www.flightera.net/en/planes/N725AN';
    const response = await axios.get(route);
    html = response.data;
    $ = Cheerio.load(html);
  });

  test('getSeatConfiguration', async () => {
    const seats = getSeatConfiguration($);
    expect(seats.economy).toBe(216);
    expect(seats.business).toBe(52);
    expect(seats.first).toBe(8);
  });

  test('getIcao', async () => {
    const icao = getIcao($);
    expect(icao).toBe('A9B62C');
  });

  test('getDescription', async () => {
    const description = getDescription($);
    expect(description).toBeString();
  });

  test('getAircraftFromHtml', async () => {
    const aircraft = getAircraftFromHtml(html);
    expect(aircraft).toBeTruthy();
  });
});
