import { ArchiveFlightJob } from './defined.jobs/flight.archive.job';
import { Class } from '@app/types/class';
import { Job } from './job';
import { Logger } from '@app/services/logger';
import { Prisma } from '@app/prisma';
import { ScheduledJob } from '@prisma/client';
import { Singleton } from '@app/lib/singleton';
import { noop } from 'lodash';

export class Scheduler extends Singleton<Scheduler>() {
  private readonly jobsToInitiate = [ArchiveFlightJob];
  private readonly initiatedJobs: Map<ScheduledJob['id'], Job> = new Map();
  private readonly logger = Logger.child({ name: Scheduler.name });

  async start() {
    this.logger.debug('Starting scheduler');
    for await (const job of this.jobsToInitiate) {
      await this.defineJob(job);
    }
  }

  private async defineJob<T extends Class<Job>>(JobInstance: T) {
    const job = new JobInstance();
    const [jobDef] = await Prisma.$transaction([
      Prisma.scheduledJob.upsert({
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
