import { Field, ObjectType, ID, Int } from 'type-graphql';

@ObjectType('ScheduledJob')
export class GQL_ScheduledJob {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => Int)
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
