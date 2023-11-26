import { Field, ObjectType, ID, Int } from 'type-graphql';
import { GQL_ValueType } from '../enums/ValueType';
import { GQL_ChangeType } from '../enums/ChangeType';
import { Prisma } from '@prisma/client';
import * as GraphQLScalars from 'graphql-scalars';
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
  valueType?: GQL_ValueType;

  @Field(() => GQL_ChangeType, { nullable: true })
  changeType?: GQL_ChangeType;

  @Field(() => GraphQLScalars.JSONResolver, { nullable: true })
  currentValue?: Prisma.JsonValue;

  @Field(() => GraphQLScalars.JSONResolver, { nullable: true })
  previousValue?: Prisma.JsonValue;

  @Field()
  timestamp: Date;

  // skip overwrite 👇
}
