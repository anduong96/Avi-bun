import {
  Arg,
  Authorized,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql';

import { GQL_UserFlight } from '@app/@generated/graphql/models/UserFlight';
import { prisma } from '@app/prisma';
import { CurrentUserID } from '../_decorators/current.user.id.decorator';
import { FlightStatus } from '@prisma/client';
import { GQL_Flight } from '@app/@generated/graphql/models/Flight';

@Resolver(() => GQL_UserFlight)
export class UserFlightResolver {
  @Authorized()
  @Query(() => Boolean)
  async userHasFlights(@CurrentUserID() userID: string) {
    const count = await prisma.userFlight.count({
      take: 1,
      where: {
        userID,
      },
    });

    return count > 0;
  }

  @Authorized()
  @Query(() => [GQL_UserFlight])
  async userActiveFlights(@CurrentUserID() userID: string) {
    const result = await prisma.userFlight.findMany({
      where: {
        userID,
        Flight: {
          status: {
            notIn: [FlightStatus.ARCHIVED, FlightStatus.CANCELED],
          },
        },
      },
      orderBy: {
        Flight: {
          estimatedGateDeparture: 'asc',
        },
      },
    });

    return result;
  }

  @Authorized()
  @Query(() => [GQL_UserFlight])
  async userArchivedFlights(@CurrentUserID() userID: string) {
    const result = await prisma.userFlight.findMany({
      where: {
        userID,
        Flight: {
          status: {
            in: [FlightStatus.ARCHIVED, FlightStatus.CANCELED],
          },
        },
      },
      orderBy: {
        Flight: {
          estimatedGateDeparture: 'desc',
        },
      },
    });

    return result;
  }

  @Authorized()
  @Query(() => GQL_UserFlight, { nullable: true })
  async userFlight(
    @CurrentUserID() userID: string,
    @Arg('flightID') flightID: string,
  ) {
    const flight = await prisma.userFlight.findFirst({
      where: {
        userID,
        flightID,
      },
    });

    return flight;
  }

  @Authorized()
  @Mutation(() => String)
  async deleteUserFlight(
    @CurrentUserID() userID: string,
    @Arg('flightID') flightID: string,
  ): Promise<string> {
    await prisma.userFlight.delete({
      where: {
        flightID_userID: {
          userID,
          flightID,
        },
      },
    });

    return flightID;
  }

  @Authorized()
  @Mutation(() => String)
  async addUserFlight(
    @CurrentUserID() userID: string,
    @Arg('flightID') flightID: string,
  ): Promise<string> {
    const record = await prisma.userFlight.upsert({
      where: {
        flightID_userID: {
          userID,
          flightID,
        },
      },
      create: {
        userID,
        flightID,
      },
      update: {},
    });

    return record.id;
  }

  @FieldResolver(() => GQL_Flight)
  Flight(@Root() root: GQL_UserFlight) {
    if (root.Flight) {
      return root.Flight;
    }

    return prisma.flight.findFirst({
      where: {
        id: root.flightID,
      },
    });
  }
}
