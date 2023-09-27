import { describe, expect, test } from 'bun:test';
import { isMsOrSeconds } from '../is.ms.or.sec';

describe('lib::isMsOrSeconds', () => {
  test('ms', () => {
    expect(isMsOrSeconds(1634517600000)).toBe('ms');
  });

  test('seconds', () => {
    expect(isMsOrSeconds(1634517600)).toBe('seconds');
  });
});
