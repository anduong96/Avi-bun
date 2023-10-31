import { Field, ObjectType, ID, Int } from 'type-graphql';

@ObjectType('Timezone')
export class GQL_Timezone {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => Int)
  gmt: number;

  @Field(() => Int)
  dst: number;

  @Field()
  countryCode: string;

  // skip overwrite 👇
}
