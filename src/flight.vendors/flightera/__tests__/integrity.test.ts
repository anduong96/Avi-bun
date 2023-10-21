import ky from 'ky';
import { describe, expect, test } from 'bun:test';

const PLANE_URL = 'https://www.flightera.net/en/planes/N725AN';
const FLIGHT_URL =
  'https://www.flightera.net/en/flight_details/American+Airlines-New+York-London/AA100/KJFK/2023-10-19';

describe('Flightera', () => {
  const urlsToTest = [PLANE_URL, FLIGHT_URL];

  for (const url of urlsToTest) {
    test(url, async () => {
      const request = await ky.get(url);
      const response = await request.text();
      expect(response).toMatchSnapshot();
    });
  }
});
