import { Field, ObjectType, ID, Int } from 'type-graphql';

@ObjectType()
export class GQL_ScheduledJob {
  @Field(_type => ID)
  id: string;

  @Field()
  name: string;

  @Field(_type => Int)
  lockDuration: number;

  @Field()
  cronTime: string;

  @Field({ nullable: true })
  lastFailedReason?: string;

  @Field({ nullable: true })
  lastFailedAt?: Date;

  @Field({ nullable: true })
  lastSucceedAt?: Date;

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