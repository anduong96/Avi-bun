import { registerEnumType } from 'type-graphql';

export enum GQL_FlightStatus {
  SCHEDULED = 'SCHEDULED',
  DEPARTED = 'DEPARTED',
  DELAYED = 'DELAYED',
  ARRIVED = 'ARRIVED',
  CANCELED = 'CANCELED',
  ARCHIVED = 'ARCHIVED',
  LANDED = 'LANDED',
}
registerEnumType(GQL_FlightStatus, {
  name: 'FlightStatus',
});
