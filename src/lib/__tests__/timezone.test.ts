import {
  afterEach,
  beforeEach,
  describe,
  expect,
  setSystemTime,
  test,
} from 'bun:test';

import { timezoneToUtcOffset } from '../timezone';

describe('lib::timezone', () => {
  beforeEach(() => {
    setSystemTime(new Date('2022-01-01T00:00:00Z'));
  });

  afterEach(() => {
    setSystemTime();
  });

  test('timezoneToUtcOffset', () => {
    expect(timezoneToUtcOffset('America/New_York')).toBe(-5);
    expect(timezoneToUtcOffset('America/Los_Angeles')).toBe(-8);
    expect(timezoneToUtcOffset('UTC')).toBe(0);
    expect(timezoneToUtcOffset('America/Chicago')).toBe(-6);
    expect(timezoneToUtcOffset('Europe/London')).toBe(0);
  });
});
