import { Field, ObjectType, ID, Int } from 'type-graphql';
import { GQL_FlightAlert } from './FlightAlert';
import { GQL_Airport } from './Airport';
import { GQL_FlightVendor } from '../enums/FlightVendor';
import { GQL_FlightStatus } from '../enums/FlightStatus';
import { GQL_UserFlight } from './UserFlight';
import { GQL_FlightPosition } from './FlightPosition';
import { GQL_FlightPlan } from './FlightPlan';

@ObjectType()
export class GQL_Flight {
  @Field(_type => ID)
  id: string;

  @Field(_type => [GQL_FlightAlert])
  FlightAlert: GQL_FlightAlert[];

  @Field(_type => GQL_Airport)
  origin: GQL_Airport;

  @Field(_type => GQL_Airport)
  destination: GQL_Airport;

  @Field()
  departureDate: Date;

  @Field()
  airlineIata: string;

  @Field()
  flightNumber: string;

  @Field({ nullable: true })
  aircraftTailnumber?: string;

  @Field(_type => GQL_FlightStatus)
  status: GQL_FlightStatus;

  @Field(_type => Int, { nullable: true })
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

  @Field(_type => Int, { nullable: true })
  reconAttempt?: number;

  @Field(_type => [GQL_UserFlight])
  UserFlight: GQL_UserFlight[];

  @Field(_type => [GQL_FlightPosition])
  FlightPositions: GQL_FlightPosition[];

  @Field(_type => GQL_FlightPlan, { nullable: true })
  FlightPlan?: GQL_FlightPlan;

  // skip overwrite 👇
}
