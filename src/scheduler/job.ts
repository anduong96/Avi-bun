import { sleep } from 'bun';

import moment from 'moment';
import parser from 'cron-parser';
import { isNil, noop } from 'lodash';
import { ScheduledJob } from '@prisma/client';

import { prisma } from '@app/prisma';
import { Logger } from '@app/lib/logger';

/**
 * TODO: Implement stop
 */
export abstract class Job {
  private _internal: ScheduledJob;
  private _isProcessing: boolean = false;

  readonly lockDurationMs: number = moment
    .duration({ minutes: 2 })
    .as('milliseconds');
  /**
   * The function `acquireLock` checks if a job is currently being processed and updates its unlock
   * time if it is not.
   * @returns The `acquireLock` function returns a Promise that resolves to a boolean value. The
   * boolean value indicates whether the lock was successfully acquired or not. If the lock was
   * acquired, the Promise resolves to `true`, otherwise it resolves to `false`.
   */
  private async acquireLock(): Promise<boolean> {
    if (this._isProcessing) {
      return false;
    }

    this.logger.debug('Acquiring lock');
    const [entry] = await prisma
      .$transaction([
        prisma.scheduledJob.update({
          data: {
            lastRunAt: moment().toDate(),
            unlockAt: moment()
              .add(this.lockDurationMs, 'milliseconds')
              .toDate(),
          },
          where: {
            OR: [{ unlockAt: null }, { unlockAt: { lte: moment().toDate() } }],
            id: this._internal.id,
          },
        }),
      ])
      .catch(() => [null]);

    const hasLock = !isNil(entry);
    this.logger.debug('Has lock', hasLock);
    return hasLock;
  }

  /**
   * The `delayTime` function calculates the time delay until the next run of a job.
   * @returns The delay time in milliseconds.
   */
  private get delayTime() {
    if (!this._internal.lastRunAt) {
      return 0;
    }

    const now = moment();
    const nextRunTime = this.getNextRunAt(this._internal.lastRunAt);
    const diff = moment(nextRunTime).diff(now);
    const nextRunMs = Math.max(diff, 0);

    this.logger.debug(
      'Last run %s seconds ago, next run in %s seconds',
      moment.duration(moment(now).diff(this._internal.lastRunAt)).as('seconds'),
      moment.duration(moment(nextRunTime).diff(now)).as('seconds'),
    );

    return nextRunMs;
  }

  /**
   * The function `getNextRunAt` calculates the next run time based on a given starting date and a cron
   * expression.
   * @param {Date} starting - The `starting` parameter is a `Date` object that represents the starting
   * point from which to calculate the next run time.
   * @returns the next run time of a job based on a given starting time.
   */
  private getNextRunAt(starting: Date) {
    const cron = parser.parseExpression(this.cronTime, {
      currentDate: starting,
    });

    return cron.next().toDate();
  }

  private async run(): Promise<void> {
    const next = { ...this._internal };
    const hasLock = await this.acquireLock();

    if (!hasLock) {
      this._internal = next;
      this._internal.lastRunAt = new Date();
      return;
    }

    this._isProcessing = true;
    try {
      await this.onPreprocess(next);
      await this.onProcess(next);
      next.lastRunAt = new Date();
      next.lastSucceedAt = new Date();
      await this.onSuccess(next);
    } catch (e) {
      try {
        const error = e as Error;
        next.lastRunAt = new Date();
        next.lastFailedAt = new Date();
        next.lastFailedReason = error.message;
        await this.onError(error, next);
      } catch {
        /* empty */
      }
    } finally {
      await this.onFinish(next);

      next.nextRunAt = this.getNextRunAt(new Date());

      this._isProcessing = false;
      this.updateJobDef(next).catch(noop);
    }
  }

  /**
   * The function "updateJob" updates the value of the "job" property with a new value.
   * @param {Schedule} newJob - The newJob parameter is of type Schedule, which means it represents a
   * schedule object.
   */
  private async updateJobDef(next: ScheduledJob): Promise<void> {
    this._internal = next;
    await prisma.scheduledJob.update({
      data: {
        lastFailedAt: next.lastFailedAt,
        lastFailedReason: next.lastFailedReason,
        lastRunAt: next.lastRunAt,
        lastSucceedAt: next.lastSucceedAt,
        nextRunAt: next.nextRunAt,
        unlockAt: next.unlockAt,
      },
      select: {
        id: true,
      },
      where: {
        id: this.id,
      },
    });

    this.logger.debug(`Job[%s] def updated`, this.name);
  }

  protected onError(error: Error, job: ScheduledJob): Promise<void> | void {
    this.logger.error(`onError job[%s]`, job.name, error);
  }

  protected onFinish(job: ScheduledJob): Promise<void> | void {
    this.logger.debug(`onFinish job[%s]`, job.name);
  }

  protected onPreprocess(job: ScheduledJob): Promise<void> | void {
    this.logger.debug(`onProcess job[%s`, job.name);
  }

  protected onSuccess(job: ScheduledJob): Promise<void> | void {
    this.logger.info(`onSuccess job[%s]`, job.name);
  }

  setDef(jobDef: ScheduledJob) {
    this._internal = jobDef;
  }

  /**
   * INTERNAL
   */

  async stop(): Promise<void> {}

  async sync(): Promise<void> {
    const delayTime = this.delayTime;
    if (delayTime === 0) {
      await this.run();
      return this.sync();
    }

    await sleep(delayTime);
    return this.sync();
  }

  get id() {
    return this._internal.id;
  }

  get logger() {
    return Logger.getSubLogger({ name: `Scheduled Job[${this.name}]` });
  }

  get name() {
    return this.constructor.name;
  }

  abstract readonly cronTime: string;

  protected abstract onProcess(job: ScheduledJob): Promise<void> | void;
}
