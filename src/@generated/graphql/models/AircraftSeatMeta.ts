import { Field, ObjectType, Int } from 'type-graphql';

@ObjectType('AircraftSeatMeta')
export class GQL_AircraftSeatMeta {
  @Field(() => Int)
  id: number;

  @Field()
  aircraftTailNumber: string;

  @Field()
  name: string;

  @Field(() => Int)
  pitchInches: number;

  @Field(() => Int)
  widthInches: number;

  // skip overwrite 👇
}
