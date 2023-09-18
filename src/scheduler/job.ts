import { isNil, noop } from 'lodash';

import { Logger } from '@app/services/logger';
import { Prisma } from '@app/prisma';
import { ScheduledJob } from '@prisma/client';
import moment from 'moment';
import parser from 'cron-parser';
import { sleep } from 'bun';

/**
 * TODO: Implement stop
 */
export abstract class Job {
  private _isProcessing: boolean = false;
  private _internal: ScheduledJob;

  abstract readonly cronTime: string;
  readonly lockDurationMs: number = moment
    .duration({ minutes: 2 })
    .as('milliseconds');

  get name() {
    return this.constructor.name;
  }

  get id() {
    return this._internal.id;
  }

  get logger() {
    return Logger.child({ name: `JOB[${this.name}]` });
  }

  setDef(jobDef: ScheduledJob) {
    this._internal = jobDef;
  }

  protected onPreprocess(job: ScheduledJob): void | Promise<void> {
    this.logger.debug(`onProcess: ${job.id}`);
  }

  protected abstract onProcess(job: ScheduledJob): void | Promise<void>;

  protected onError(error: Error, job: ScheduledJob): void | Promise<void> {
    this.logger.error(error, `onError: ${job.id}`);
  }

  protected onSuccess(job: ScheduledJob): void | Promise<void> {
    this.logger.info(`onSuccess: ${job.id}`);
  }

  protected onFinish(job: ScheduledJob): void | Promise<void> {
    this.logger.debug(`onFinish: ${job.id}`);
  }

  /**
   * INTERNAL
   */

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

    this.logger.debug({
      nextRun: moment.duration(diff).as('seconds') + 's',
      lastRunAt: this._internal.lastRunAt,
    });

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

  /**
   * The function "updateJob" updates the value of the "job" property with a new value.
   * @param {Schedule} newJob - The newJob parameter is of type Schedule, which means it represents a
   * schedule object.
   */
  private async updateJobDef(next: ScheduledJob): Promise<void> {
    this._internal = next;
    await Prisma.scheduledJob.update({
      where: {
        id: this.id,
      },
      data: {
        nextRunAt: next.nextRunAt,
        lastFailedAt: next.lastFailedAt,
        lastFailedReason: next.lastFailedReason,
        lastSucceedAt: next.lastSucceedAt,
        lastRunAt: next.lastRunAt,
        unlockAt: next.unlockAt,
      },
      select: {
        id: true,
      },
    });

    this.logger.debug(`Job def updated: ${this.id}`);
  }

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
    const [entry] = await Prisma.$transaction([
      Prisma.scheduledJob.update({
        where: {
          id: this._internal.id,
          OR: [
            {
              unlockAt: null,
            },
            {
              unlockAt: {
                lte: moment().toDate(),
              },
            },
          ],
        },
        data: {
          unlockAt: moment().add(this.lockDurationMs, 'milliseconds').toDate(),
          lastRunAt: moment().toDate(),
        },
      }),
    ]).catch(() => [null]);

    const hasLock = !isNil(entry);
    this.logger.debug('Has lock', hasLock);
    return hasLock;
  }

  private async run(): Promise<void> {
    const next = { ...this._internal };
    const hasLock = await this.acquireLock();

    if (!hasLock) {
      this._internal = next;
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

  async stop(): Promise<void> {}

  async sync(): Promise<void> {
    const delayTime = this.delayTime;
    if (delayTime === 0) {
      await this.run();
      return this.sync();
    }

    this.logger.debug(`Run in ${delayTime}ms`);
    await sleep(delayTime);
    return this.sync();
  }
}
