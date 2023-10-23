import { describe, expect, test } from 'bun:test';

import { Flightera } from '..';

describe('Vendor::Flightera', () => {
  test('getAuthToken', async () => {
    const token = await Flightera.getAuthToken();
    expect(token).toBeTruthy();
  });
});
