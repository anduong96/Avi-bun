import { FlightStatus } from '@prisma/client';
import { describe, expect, it, test } from 'bun:test';

import { toFlightStatus } from '../utils';
import { FlightStats_Status } from '../enums';

describe('Flight Stats', () => {
  test('toFlightStatus', () => {
    it('should return ARCHIVED when flight status is ARRIVED', () => {
      expect(toFlightStatus(FlightStats_Status.ARRIVED)).toBe(
        FlightStatus.ARCHIVED,
      );
    });

    it('should return CANCELED when flight status is CANCELED', () => {
      expect(toFlightStatus(FlightStats_Status.CANCELED)).toBe(
        FlightStatus.CANCELED,
      );
    });

    it('should return DEPARTED when flight status is DEPARTED', () => {
      expect(toFlightStatus(FlightStats_Status.DEPARTED)).toBe(
        FlightStatus.DEPARTED,
      );
    });

    it('should return LANDED when flight status is LANDED', () => {
      expect(toFlightStatus(FlightStats_Status.LANDED)).toBe(
        FlightStatus.LANDED,
      );
    });

    it('should return SCHEDULED when flight status is SCHEDULED', () => {
      expect(toFlightStatus(FlightStats_Status.SCHEDULED)).toBe(
        FlightStatus.SCHEDULED,
      );
    });

    it('should return SCHEDULED when flight status is ESTIMATED', () => {
      expect(toFlightStatus(FlightStats_Status.ESTIMATED)).toBe(
        FlightStatus.SCHEDULED,
      );
    });

    it('should return SCHEDULED when an unknown status is provided', () => {
      expect(toFlightStatus('UNKNOWN_STATUS')).toBe(FlightStatus.SCHEDULED);
    });
  });
});
