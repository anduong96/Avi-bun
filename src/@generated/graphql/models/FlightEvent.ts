import { Field, ObjectType, ID, Int } from 'type-graphql'
import { GQL_ValueType } from '../enums/ValueType'
import { Prisma } from '@prisma/client'
import GraphQLScalars from 'graphql-scalars'

@ObjectType()
export class GQL_FlightEvent {
  @Field((_type) => ID)
  id: string

  @Field()
  flightTimelineID: string

  @Field((_type) => Int)
  index: number

  @Field()
  flightID: string

  @Field()
  description: string

  @Field()
  requireAlert: boolean

  @Field((_type) => GQL_ValueType, { nullable: true })
  changedValueType?: GQL_ValueType

  @Field((_type) => GQL_ValueType, { nullable: true })
  prevValueType?: GQL_ValueType

  @Field((_type) => GraphQLScalars.JSONResolver, { nullable: true })
  changedValue?: Prisma.JsonValue

  @Field((_type) => GraphQLScalars.JSONResolver, { nullable: true })
  prevValue?: Prisma.JsonValue

  @Field()
  timestamp: Date

  // skip overwrite 👇