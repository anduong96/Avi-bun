import { Field, ObjectType, ID, Int } from 'type-graphql';
import { Prisma } from '@app/@generated/prisma.client';
import * as GraphQLScalars from 'graphql-scalars';

@ObjectType('ScheduledJob')
export class GQL_ScheduledJob {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => Int)
  lockDurationMs: number;

  @Field(() => GraphQLScalars.JSONResolver, { nullable: true })
  props?: Prisma.JsonValue;

  @Field({ nullable: true })
  cronTime?: string;

  @Field({ nullable: true })
  error?: string;

  @Field({ nullable: true })
  lastFailedReason?: string;

  @Field({ nullable: true })
  lastFailedAt?: Date;

  @Field({ nullable: true })
  lastSucceedAt?: Date;

  @Field({ nullable: true })
  deleteAt?: Date;

  @Field({ nullable: true })
  unlockAt?: Date;

  @Field({ nullable: true })
  nextRunAt?: Date;

  @Field({ nullable: true })
  lastRunAt?: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  // skip overwrite 👇
}
