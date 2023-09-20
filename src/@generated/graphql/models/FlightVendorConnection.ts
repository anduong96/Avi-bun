import { Field, ObjectType, Int } from 'type-graphql';
import { GQL_FlightVendor } from '../enums/FlightVendor';
import { GQL_Flight } from './Flight';

@ObjectType()
export class GQL_FlightVendorConnection {
  @Field(_type => Int)
  id: number;

  @Field(_type => GQL_FlightVendor)
  vendor: GQL_FlightVendor;

  @Field()
  vendorResourceID: string;

  @Field()
  flightID: string;

  @Field(_type => GQL_Flight)
  Flight: GQL_Flight;

  // skip overwrite 👇
}
