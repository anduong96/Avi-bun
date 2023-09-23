import { Field, ObjectType, ID, Int } from 'type-graphql';
import { GQL_ValueType } from '../enums/ValueType';
import { Prisma } from '@prisma/client';
import GraphQLScalars from 'graphql-scalars';

@ObjectType('FlightEvent')
export class GQL_FlightEvent {
  @Field(() => ID)
  id: string;

  @Field()
  flightTimelineID: string;

  @Field(() => Int)
  index: number;

  @Field()
  flightID: string;

  @Field()
  description: string;

  @Field()
  requireAlert: boolean;

  @Field(() => GQL_ValueType, { nullable: true })
  changedValueType?: GQL_ValueType;

  @Field(() => GQL_ValueType, { nullable: true })
  prevValueType?: GQL_ValueType;

  @Field(() => GraphQLScalars.JSONResolver, { nullable: true })
  changedValue?: Prisma.JsonValue;

  @Field(() => GraphQLScalars.JSONResolver, { nullable: true })
  prevValue?: Prisma.JsonValue;

  @Field()
  timestamp: Date;

  // skip overwrite 👇
}
