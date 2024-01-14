import { prisma } from '@app/prisma';

import { Job } from '../job';

type Props = {
  userID: string;
};

export class UserPreferenceCreateJob extends Job<Props> {
  constructor(props: Props) {
    super({
      props,
    });
  }
  override async onProcess(props: Props): Promise<void> {
    const entry = await prisma.userPreference.create({
      data: {
        userID: props.userID,
      },
      select: {
        id: true,
      },
    });

    this.logger.debug(
      'Created user preference: userID=%s, ID=%s',
      props.userID,
      entry.id,
    );
  }
}
