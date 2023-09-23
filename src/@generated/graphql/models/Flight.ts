import { Field, ID, Int, ObjectType } from 'type-graphql';
import { GQL_FlightStatus } from '../enums/FlightStatus';
import { GQL_Airline } from './Airline';
import { GQL_Airport } from './Airport';
import { Field, ObjectType, ID, Int } from 'type-graphql';

@ObjectType('Flight')
export class GQL_Flight {
  @Field(() => ID)
  id: string;

  @Field()
  departureDate: Date;

  @Field()
  airlineIata: string;

  @Field()
  flightNumber: string;

  @Field({ nullable: true })
  aircraftTailnumber?: string;

  @Field(() => GQL_FlightStatus)
  status: GQL_FlightStatus;

  @Field(() => Int, { nullable: true })
  totalDistanceKm?: number;

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

  @Field(() => Int, { nullable: true })
  reconAttempt?: number;

  @Field(() => GQL_Airport)
  Origin: GQL_Airport;

  @Field(() => GQL_Airport)
  Destination: GQL_Airport;

  @Field(() => GQL_Airline)
  Airline: GQL_Airline;

  // skip overwrite 👇
}
