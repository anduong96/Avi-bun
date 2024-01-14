import { Flight } from '@prisma/client';

import { handleFlightChangesForAlert } from '@app/services/alerts/alert.engine';

import { Job } from '../job';

type Props = {
  current: Flight;
  previous: Flight;
};

export class FlightAlertSyncJob extends Job<Props> {
  constructor(props: Props) {
    super({
      props: {
        current: props.current,
        previous: props.previous,
      },
    });
  }
  override async onProcess(props: Props): Promise<void> {
    await handleFlightChangesForAlert(props.previous, props.current);
  }
}
