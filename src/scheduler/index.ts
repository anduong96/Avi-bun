import { Singleton } from '@app/lib/singleton';
import { prisma } from '@app/prisma';
import { Class } from '@app/types/class';
import { ScheduledJob } from '@prisma/client';
import { isEmpty, noop } from 'lodash';
import { ArchiveFlightJob } from './defined.jobs/flight.archive.job';
import { RemindCheckinFlightsJob } from './defined.jobs/flight.checkin.reminder.job';
import { PatchFlightsJob } from './defined.jobs/flight.patch.job';
import { Job } from './job';
import { SyncActiveFlightsJob } from './defined.jobs/flight.sync.job';
import { SyncActivePlaneLocationJob } from './defined.jobs/plane.sync.job';

export class Scheduler extends Singleton<Scheduler>() {
  private readonly initiatedJobs: Map<ScheduledJob['id'], Job> = new Map();
  private readonly jobsToInitiate = [
    ArchiveFlightJob,
    RemindCheckinFlightsJob,
    PatchFlightsJob,
    SyncActiveFlightsJob,
    SyncActivePlaneLocationJob,
  ];

  constructor() {
    super();
    this.logger.debug('Initialized');
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

  private async defineJob<T extends Class<Job>>(JobInstance: T) {
    const job = new JobInstance();
    const [jobDef] = await prisma.$transaction([
      prisma.scheduledJob.upsert({
        where: {
          name: job.name,
        },
        update: {},
        create: {
          name: job.name,
          cronTime: job.cronTime,
          lockDuration: job.lockDurationMs,
        },
      }),
    ]);

    job.setDef(jobDef);
    job.sync().catch(noop);

    this.logger.debug(`Defined Job: ${job.name}`);
    this.initiatedJobs.set(job.id, job);
  }
}
