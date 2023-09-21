import { describe, expect, it, test } from 'bun:test';

import { parseFlightIdFromUrl } from '../utils';

describe('Flight Stats', () => {
  test('parseFlightIdFromUrl', () => {
    it('should return the flightId when it is present in the URL', () => {
      const url =
        '/flight-tracker/AA/1328?year=2023&month=08&date=26&flightId=1207666509';

      expect(parseFlightIdFromUrl(url)).toBe('1207666509');
    });

    it('should return null when the URL does not contain flightId', () => {
      const url = '/flight-tracker/AA/1328?year=2023&month=08&date=26';
      expect(parseFlightIdFromUrl(url)).toBe(null);
    });

    it('should return null for an empty URL', () => {
      const url = '';
      expect(parseFlightIdFromUrl(url)).toBe(null);
    });

    it('should return null when the URL is invalid', () => {
      const url = 'invalid-url';
      expect(parseFlightIdFromUrl(url)).toBe(null);
    });

    it('should return null when the URL contains no query parameters', () => {
      const url = '/flight-tracker/AA/1328';
      expect(parseFlightIdFromUrl(url)).toBe(null);
    });
  });
});
