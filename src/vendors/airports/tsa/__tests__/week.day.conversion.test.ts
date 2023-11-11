import moment from 'moment';
import { describe, expect, test } from 'bun:test';

describe('Vendor::TSA::sanity tests', () => {
  test('Convert Day', () => {
    const weekdays = [
      ['Monday', 1],
      ['Tuesday', 2],
      ['Wednesday', 3],
      ['Thursday', 4],
      ['Friday', 5],
      ['Saturday', 6],
      ['Sunday', 0],
    ];

    for (const [weekday, day] of weekdays) {
      expect(moment().day(weekday).day()).toBe(day);
      expect(moment().day(day).weekday()).toBe(day);
      expect(moment().day(day).format('dddd')).toBe(weekday);
    }
  });
});
