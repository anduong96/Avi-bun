import { Field, ObjectType, Int } from 'type-graphql';
import { GQL_FlightVendor } from '../enums/FlightVendor';

@ObjectType()
export class GQL_FlightVendorConnection {
  @Field(() => Int)
  id: number;

  @Field(() => GQL_FlightVendor)
  vendor: GQL_FlightVendor;

  @Field()
  vendorResourceID: string;

  @Field()
  flightID: string;

  // skip overwrite 👇
}
