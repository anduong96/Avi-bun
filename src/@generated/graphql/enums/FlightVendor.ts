import { registerEnumType } from 'type-graphql';

export enum GQL_FlightVendor {
  FLIGHT_STATS = 'FLIGHT_STATS',
  AERO_DATA_BOX = 'AERO_DATA_BOX',
}
registerEnumType(GQL_FlightVendor, {
  name: 'FlightVendor',
});
