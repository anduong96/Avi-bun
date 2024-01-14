import { Field, ObjectType, ID } from 'type-graphql';
import { Prisma } from '@app/@generated/prisma.client';
import * as GraphQLScalars from 'graphql-scalars';

@ObjectType('JsonCache')
export class GQL_JsonCache {
  @Field(() => ID)
  id: string;

  @Field(() => GraphQLScalars.JSONResolver)
  data: Prisma.JsonValue;

  @Field()
  expiresAt: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  // skip overwrite 👇
}
