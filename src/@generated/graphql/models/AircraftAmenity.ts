import { Field, ObjectType, Int } from 'type-graphql';
import { GQL_AircraftAmenityType } from '../enums/AircraftAmenityType';

@ObjectType('AircraftAmenity')
export class GQL_AircraftAmenity {
  @Field(() => Int)
  id: number;

  @Field()
  aircraftTailNumber: string;

  @Field(() => GQL_AircraftAmenityType)
  type: GQL_AircraftAmenityType;

  @Field()
  descriptionMarkdown: string;

  // skip overwrite 👇
}
