import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType('Aircraft')
export class GQL_Aircraft {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  iata?: string;

  @Field()
  icao: string;

  @Field()
  model: string;

  @Field()
  airlineIata: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  tailNumber: string;

  @Field({ nullable: true })
  imageURL?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  // skip overwrite 👇
}
