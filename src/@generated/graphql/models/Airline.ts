import { Field, ObjectType, ID } from 'type-graphql';
import { GQL_ImageType } from '../enums/ImageType';
import { GQL_Flight } from './Flight';

@ObjectType('Airline')
export class GQL_Airline {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  iata: string;

  @Field({ nullable: true })
  icao?: string;

  @Field({ nullable: true })
  logoFullImageURL?: string;

  @Field(() => GQL_ImageType, { nullable: true })
  logoFullImageType?: GQL_ImageType;

  @Field({ nullable: true })
  logoCompactImageURL?: string;

  @Field(() => GQL_ImageType, { nullable: true })
  logoCompactImageType?: GQL_ImageType;

  @Field({ nullable: true })
  isLowCost?: boolean;

  @Field(() => [GQL_Flight])
  Flight: GQL_Flight[];

  // skip overwrite 👇
}
