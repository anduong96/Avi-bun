import { isEmpty, noop } from 'lodash';
import { ScheduledJob } from '@prisma/client';

import { prisma } from '@app/prisma';
import { Class } from '@app/types/class';
import { Singleton } from '@app/lib/singleton';

import { Job } from './job';
import { PatchFlightsJob } from './defined.jobs/flight.patch.job';
import { ArchiveFlightJob } from './defined.jobs/flight.archive.job';
import { SyncActiveFlightsJob } from './defined.jobs/flight.sync.job';
import { SyncActivePlaneLocationJob } from './defined.jobs/plane.sync.job';
import { RemindCheckInFlightsJob } from './defined.jobs/flight.check.in.reminder.job';

export class _Scheduler extends Singleton<_Scheduler>() {
  private readonly initiatedJobs: Map<ScheduledJob['id'], Job> = new Map();
  private readonly jobsToInitiate = [
    ArchiveFlightJob,
    RemindCheckInFlightsJob,
    PatchFlightsJob,
    SyncActiveFlightsJob,
    SyncActivePlaneLocationJob,
  ];

  constructor() {
    super();
    this.logger.debug('Initialized');
  }

  private async defineJob<T extends Class<Job>>(JobInstance: T) {
    const job = new JobInstance();
    const [jobDef] = await prisma.$transaction([
      prisma.scheduledJob.upsert({
        create: {
          cronTime: job.cronTime,
          lockDuration: job.lockDurationMs,
          name: job.name,
        },
        update: {},
        where: {
          name: job.name,
        },
      }),
    ]);

    job.setDef(jobDef);
    job.sync().catch(noop);

    this.logger.debug(`Defined Job: ${job.name}`);
    this.initiatedJobs.set(job.id, job);
  }

  async start() {
    this.logger.debug('Starting scheduler');
    if (!isEmpty(this.initiatedJobs)) {
      this.logger.debug('Already initiated jobs');
      return;
    }

    for await (const job of this.jobsToInitiate) {
      await this.defineJob(job);
    }
  }
}

export const Scheduler = _Scheduler.instance;

await Scheduler.start();
