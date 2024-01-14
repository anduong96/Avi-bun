import moment from 'moment';
import { format } from 'sys';
import { isNil, noop } from 'lodash';
import { Prisma, ScheduledJob } from '@prisma/client';

import { prisma } from '@app/prisma';
import { delay } from '@app/lib/delay';
import { Logger } from '@app/lib/logger';
import { castError } from '@app/lib/cast.error';
import { getNextCronTime } from '@app/lib/get.next.cron.time';

import { Job } from './job';
import { JobType } from './types';
import { applyNextRunAt } from './utils/apply.next.run.at';

export class Scheduler {
  private static _isProcessing: boolean = false;
  private static readonly INTERVAL_MS = moment.duration({ minute: 1 }).as('ms');
  private static readonly MAX_JOBS_TO_RUN = 50;
  private static intervalRef: NodeJS.Timeout;
  private static jobs: Map<string, JobType> = new Map();
  private static readonly logger = Logger.getSubLogger({ name: 'Scheduler' });

  static define(job: JobType) {
    const jobName = job.name;

    if (this.jobs.has(jobName)) {
      return;
    }

    this.logger.debug('Defining job: name=%s', jobName);
    this.jobs.set(jobName, job);
  }

  static get isProcessing() {
    return this._isProcessing;
  }

  static async schedule<T>(time: Date | string, job: Job<T>) {
    await this.upsertJob(applyNextRunAt(job.definition, time));
  }

  static async start() {
    this.run();
    await delay(this.INTERVAL_MS);
    this.start();

    setInterval(
      () => {
        this.deleteExpiredJobs().catch(noop);
      },
      moment.duration({ day: 1 }).as('ms'),
    );
  }

  static stop() {
    this.logger.debug('Stopping scheduler');

    if (this.intervalRef) {
      clearInterval(this.intervalRef);
    }
  }

  private static applyJob(jobDef: ScheduledJob) {
    const job = this.jobs.get(jobDef.name);

    if (!job) {
      this.logger.error('Job not found: name=%s', jobDef.name);
      return null;
    }

    return job.clone(jobDef);
  }

  private static async deleteExpiredJobs() {
    this.logger.debug('Deleting expired jobs');
    const result = await prisma.scheduledJob.deleteMany({
      where: {
        deleteAt: {
          lte: new Date(),
        },
      },
    });

    if (result.count > 0) {
      this.logger.warn('Deleted expired jobs', result);
    }
  }

  private static async getRunnableJobs() {
    const now = new Date();
    const jobNames = Array.from(this.jobs.keys());
    this.logger.debug('Getting runnable jobs: ', jobNames);
    const [jobDefs] = await prisma.$transaction([
      prisma.scheduledJob.findMany({
        orderBy: { nextRunAt: 'asc' },
        take: this.MAX_JOBS_TO_RUN,
        where: {
          AND: [
            { OR: jobNames.map(name => ({ name, nextRunAt: { lte: now } })) },
            { OR: [{ unlockAt: { gte: now } }, { unlockAt: null }] },
          ],
        },
      }),
    ]);

    const jobs = jobDefs
      .map(def => this.applyJob(def))
      .filter(job => !isNil(job));

    return jobs as Job<unknown>[];
  }

  private static async lockJobs(jobs: Job<unknown>[]) {
    if (jobs.length === 0) {
      return;
    }

    this.logger.debug(
      'Locking jobs',
      jobs.map(job => job.jobID),
    );

    const now = new Date();
    await Promise.allSettled(
      jobs.map(job =>
        prisma.scheduledJob.update({
          data: {
            lastRunAt: now,
            unlockAt: moment(now)
              .add(job.definition.lockDurationMs, 'ms')
              .toDate(),
          },
          where: {
            id: job.jobID,
          },
        }),
      ),
    );
  }

  private static async processJob(job: Job<unknown>) {
    try {
      job.definition.lastRunAt = new Date();
      await job.onProcess(job.definition.props);
    } catch (error) {
      await job.onError?.(castError(error));
    } finally {
      await job.onFinish?.();
      await this.unlockJob(job);
    }
  }

  private static async processJobs(jobs: Job<unknown>[]) {
    try {
      this.logger.debug('Processing jobs: count=%s', jobs.length);
      await this.lockJobs(jobs);
    } catch (error) {
      this.logger.debug('Failed to lock jobs', error);
      return;
    }

    await Promise.allSettled(jobs.map(job => this.processJob(job)));
  }

  private static async run() {
    this._isProcessing = true;
    const jobs = await this.getRunnableJobs();
    this.logger.debug('Jobs to run: count=%s', jobs.length);
    await this.processJobs(jobs);
    this._isProcessing = false;
  }

  private static async unlockJob(job: Job<unknown>) {
    const nextRunAt = getNextCronTime(job.definition.cronTime);
    const deleteAt = moment(nextRunAt ?? new Date())
      .add(10, 'day')
      .toDate();

    this.logger.debug(
      'Unlocking job: name=%s, ID=%s, nextRunAt=%s, deleteAt=%s',
      job.jobName,
      job.jobID,
      nextRunAt,
      deleteAt,
    );

    try {
      await prisma.scheduledJob.update({
        data: {
          deleteAt: deleteAt,
          error: job.definition.error,
          lastFailedAt: job.definition.lastFailedAt,
          lastFailedReason: job.definition.lastFailedReason,
          lastRunAt: job.definition.lastRunAt,
          lastSucceedAt: job.definition.lastSucceedAt,
          nextRunAt: nextRunAt,
          unlockAt: null,
        },
        select: {
          id: true,
        },
        where: {
          id: job.jobID,
        },
      });
    } catch (error) {
      this.logger.error(
        format('Failed to unlock jobID=%s', job.jobID),
        castError(error),
      );
    }
  }

  private static async upsertJob(job: ScheduledJob) {
    this.logger.debug('Upserting job: name=%s, ID=%s', job.name, job.id);

    try {
      const jobCreatedAt = job.createdAt ?? new Date();
      const entry = await prisma.scheduledJob.upsert({
        create: job as Prisma.ScheduledJobCreateInput,
        select: { createdAt: true, id: true },
        update: {},
        where: { id: job.id },
      });

      const now = moment();
      const wasCreated = moment(jobCreatedAt).isSame(entry.createdAt, 'second');
      if (wasCreated && now.isAfter(job.nextRunAt)) {
        const jobInstance = this.applyJob(job);
        if (jobInstance) {
          await this.processJobs([jobInstance]);
        }
      } else if (!wasCreated) {
        this.logger.debug('Job exists: name=%s, ID=%s', job.name, job.id);
      }
    } catch (error) {
      return;
    }
  }
}
