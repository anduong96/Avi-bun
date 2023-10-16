import moment from 'moment';
import { describe, expect, test } from 'bun:test';

import { toDateOrNull } from '../date.or.null';

describe('toDateOrNull', () => {
  test('should return null when input is falsy', () => {
    expect(toDateOrNull(null)).toBeNull();
    expect(toDateOrNull(undefined)).toBeNull();
    expect(toDateOrNull(0)).toBeNull();
    expect(toDateOrNull('')).toBeNull();
  });

  test('should return a Date object when input is not null', () => {
    const date = new Date();
    expect(toDateOrNull(date)).toEqual(date);

    const dateString = '2022-01-01';
    const expectedDate = moment(dateString).toDate();
    expect(toDateOrNull(dateString)).toEqual(expectedDate);

    const momentObj = moment(date);
    expect(toDateOrNull(momentObj)).toEqual(date);
  });
});
