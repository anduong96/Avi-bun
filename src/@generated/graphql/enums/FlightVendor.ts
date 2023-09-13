import { registerEnumType } from 'type-graphql'

export enum GQL_FlightVendor {
  FLIGHT_STATS = 'FLIGHT_STATS'
}
registerEnumType(GQL_FlightVendor, {
    name: 'FlightVendor',
})
