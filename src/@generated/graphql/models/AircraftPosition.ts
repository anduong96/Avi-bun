import { Field, ObjectType, Int } from 'type-graphql';

@ObjectType('AircraftPosition')
export class GQL_AircraftPosition {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  aircraftID: number;

  @Field(() => Int, { nullable: true })
  latitude?: number;

  @Field(() => Int, { nullable: true })
  longitude?: number;

  @Field(() => Int, { nullable: true })
  altitude?: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  // skip overwrite 👇
}
