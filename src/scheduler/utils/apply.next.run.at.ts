import { isNil } from 'lodash';
import { ScheduledJob } from '@prisma/client';

import { assert } from '@app/lib/assert';

export function applyNextRunAt(job: ScheduledJob, time: Date | string) {
  const entry = { ...job };

  if (typeof time === 'string') {
    entry.nextRunAt = new Date();
    assert(!isNil(entry.nextRunAt), `Failed to get next run for cron: ${time}`);
    entry.cronTime = time;
  } else {
    entry.nextRunAt = time;
  }

  return entry;
}
