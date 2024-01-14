import moment from 'moment';

import { prisma } from '@app/prisma';
import { getOrCreateAircraft } from '@app/services/aircraft/get.or.create.aircraft';
import { updateAircraftPosition } from '@app/services/aircraft/update.aircraft.position';

import { Job } from '../job';

type Props = {
  flightID: string;
};

export class CreateAircraftJob extends Job<Props> {
  constructor(flightID: string) {
    super({
      props: {
        flightID,
      },
    });
  }
  override async onProcess(props: Props): Promise<void> {
    const flight = await prisma.flight.findFirstOrThrow({
      select: {
        aircraftTailNumber: true,
        estimatedGateDeparture: true,
      },
      where: {
        id: props.flightID,
      },
    });

    if (flight.aircraftTailNumber) {
      const aircraft = await getOrCreateAircraft(flight.aircraftTailNumber);
      const is12HoursUntilDeparture = moment()
        .add(12, 'hours')
        .isSameOrAfter(flight.estimatedGateDeparture);

      if (is12HoursUntilDeparture) {
        await updateAircraftPosition(aircraft);
      }
    }
  }
}
