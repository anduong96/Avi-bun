import { Field, ObjectType, ID, Int, Float } from 'type-graphql';
import { GQL_FlightStatus } from '../enums/FlightStatus';
import { GQL_Airline } from './Airline';
import { GQL_Airport } from './Airport';

@ObjectType('Flight')
export class GQL_Flight {
  @Field(() => ID)
  id: string;

  @Field(() => Int)
  flightYear: number;

  @Field(() => Int)
  flightMonth: number;

  @Field(() => Int)
  flightDate: number;

  @Field()
  airlineIata: string;

  @Field()
  flightNumber: string;

  @Field({ nullable: true })
  aircraftTailNumber?: string;

  @Field(() => GQL_FlightStatus)
  status: GQL_FlightStatus;

  @Field(() => Int, { nullable: true })
  totalDistanceKm?: number;

  @Field(() => Int)
  originUtcHourOffset: number;

  @Field()
  originIata: string;

  @Field({ nullable: true })
  originGate?: string;

  @Field({ nullable: true })
  originTerminal?: string;

  @Field()
  destinationIata: string;

  @Field({ nullable: true })
  destinationGate?: string;

  @Field(() => Int)
  destinationUtcHourOffset: number;

  @Field({ nullable: true })
  destinationTerminal?: string;

  @Field({ nullable: true })
  destinationBaggageClaim?: string;

  @Field()
  scheduledGateDeparture: Date;

  @Field()
  estimatedGateDeparture: Date;

  @Field({ nullable: true })
  actualGateDeparture?: Date;

  @Field()
  scheduledGateArrival: Date;

  @Field()
  estimatedGateArrival: Date;

  @Field({ nullable: true })
  actualGateArrival?: Date;

  @Field(() => Float, { nullable: true })
  co2EmissionKgEconomy?: number;

  @Field(() => Float, { nullable: true })
  co2EmissionKgFirst?: number;

  @Field(() => Float, { nullable: true })
  co2EmissionKgBusiness?: number;

  @Field(() => Float, { nullable: true })
  co2EmissionKgEco?: number;

  @Field(() => Int, { nullable: true })
  reconAttempt?: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => GQL_Airline)
  Airline: GQL_Airline;

  @Field(() => GQL_Airport)
  Destination: GQL_Airport;

  @Field(() => GQL_Airport)
  Origin: GQL_Airport;

  // skip overwrite 👇
}
