import { Field, ObjectType, ID } from 'type-graphql';
import { Prisma } from '@prisma/client';
import * as GraphQLScalars from 'graphql-scalars';
import GraphQLScalars from 'graphql-scalars';
import { Prisma } from '@app/@generated/prisma.client';

@ObjectType('JsonCache')
export class GQL_JsonCache {
  @Field(() => ID)
  id: string;

  @Field(() => GraphQLScalars.JSONResolver)
  data: Prisma.JsonValue;

  @Field()
  expiresAt: Date;

  // skip overwrite 👇
}
