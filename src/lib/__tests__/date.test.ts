import moment from 'moment';
import { describe, expect, test } from 'bun:test';

describe('lib:Date', () => {
  test('get correct date', () => {
    const year = 2023;
    const month = 1;
    const date = 23;
    const target = moment({ date, month, year });
    const targetDate = target.toDate();

    expect(target.format('YYYY-MM-DD')).toBe('2023-02-23');

    expect(target.get('year')).toBe(year);
    expect(target.get('month')).toBe(month);
    expect(target.get('date')).toBe(date);

    expect(targetDate.getFullYear()).toBe(year);
    expect(targetDate.getMonth()).toBe(month);
    expect(targetDate.getDate()).toBe(date);
  });
});
