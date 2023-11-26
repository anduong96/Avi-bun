import {
  Arg,
  Authorized,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql';

import { prisma } from '@app/prisma';
import { GQL_Flight } from '@app/@generated/graphql/models/Flight';
import { GQL_UserFlight } from '@app/@generated/graphql/models/UserFlight';
import { saveFlightToUser } from '@app/services/user.flight/save.flight.to.user';
import { getUserActiveFlights } from '@app/services/user.flight/get.user.active.flights';
import { getUserArchivedFlights } from '@app/services/user.flight/get.user.archived.flights';

import { CurrentUserID } from '../_decorators/current.user.id.decorator';

@Resolver(() => GQL_UserFlight)
export class UserFlightResolver {
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

  @Authorized()
  @Mutation(() => String)
  async addUserFlight(
    @CurrentUserID() userID: string,
    @Arg('flightID') flightID: string,
  ): Promise<string> {
    const record = await saveFlightToUser(flightID, userID);
    return record.id;
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
          flightID,
          userID,
        },
      },
    });

    return flightID;
  }

  @Authorized()
  @Query(() => [GQL_UserFlight])
  async userActiveFlights(@CurrentUserID() userID: string) {
    const flights = await getUserActiveFlights(userID);
    return flights;
  }

  @Authorized()
  @Query(() => [GQL_UserFlight])
  async userArchivedFlights(@CurrentUserID() userID: string) {
    const flights = await getUserArchivedFlights(userID);
    return flights;
  }

  @Authorized()
  @Query(() => GQL_UserFlight, { nullable: true })
  async userFlight(
    @CurrentUserID() userID: string,
    @Arg('flightID') flightID: string,
  ) {
    const flight = await prisma.userFlight.findFirst({
      where: {
        flightID,
        userID,
      },
    });

    return flight;
  }

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
}
