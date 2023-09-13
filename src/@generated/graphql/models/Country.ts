import { Field, ObjectType, ID } from 'type-graphql'
import { GQL_ImageType } from '../enums/ImageType'

@ObjectType()
export class GQL_Country {
  @Field((_type) => ID)
  id: string

  @Field()
  name: string

  @Field()
  isoCode: string

  @Field()
  dialCode: string

  @Field()
  flagImageURL: string

  @Field((_type) => GQL_ImageType)
  flagImageType: GQL_ImageType

  // skip overwrite 👇
}