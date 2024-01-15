import moment from 'moment';

import { prisma } from '@app/prisma';
import { createAircraftMeta } from '@app/services/aircraft/create.aircraft.meta';

import { Job } from '../job';

type Props = {
  flightID: string;
};

export class CreateAircraftMetaJob extends Job<Props> {
  constructor(props: Props) {
    super({
      props,
    });
  }

  override async onProcess(): Promise<void> {
    const flightID = this.props.flightID;
    this.logger.debug('Creating aircraft meta for flight=%s', flightID);
    const flight = await prisma.flight.findFirstOrThrow({
      select: {
        aircraftTailNumber: true,
        airlineIata: true,
        flightDate: true,
        flightMonth: true,
        flightNumber: true,
        flightYear: true,
        scheduledGateDeparture: true,
      },
      where: {
        id: flightID,
      },
    });

    try {
      await createAircraftMeta(flight);
      this.definition.nextRunAt = moment(flight.scheduledGateDeparture)
        .subtract(10, 'day')
        .toDate();
    } catch (error) {
      this.logger.error(
        'Failed to create aircraft meta for flight=%s',
        flightID,
      );
      this.logger.error(error);
    }
  }
}
