import { describe, expect, test } from 'bun:test';

import { timezoneToUtcOffset } from '..';

describe('timezoneToUtcOffset', () => {
  test('should return the correct UTC offset for a given timezone', () => {
    expect(timezoneToUtcOffset('America/New_York')).toEqual(-5);
    expect(timezoneToUtcOffset('Europe/London')).toEqual(0);
    expect(timezoneToUtcOffset('Asia/Tokyo')).toEqual(9);
  });
});
