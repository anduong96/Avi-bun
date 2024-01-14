import { registerEnumType } from 'type-graphql';

export enum GQL_AircraftAmenityType {
  INTERNET = 'INTERNET',
  FOOD = 'FOOD',
  AC_POWER = 'AC_POWER',
  AUDIO = 'AUDIO',
  VIDEO = 'VIDEO',
}
registerEnumType(GQL_AircraftAmenityType, {
  name: 'AircraftAmenityType',
});
