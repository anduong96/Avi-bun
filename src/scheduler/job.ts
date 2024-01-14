import hash from 'object-hash';
import { isNil } from 'lodash';
import { ScheduledJob } from '@prisma/client';

import { Logger } from '@app/lib/logger';

export abstract class Job<Props = never> {
  private _internal: ScheduledJob;

  constructor(
    definition?: Partial<Pick<ScheduledJob, 'lockDurationMs'>> & {
      props: Props extends never ? undefined : Props;
    },
  ) {
    const jobName = this.jobName;
    const jobProps = definition?.props ?? null;
    const jobID = hash({ name: jobName, props: jobProps });
    this._internal = {
      createdAt: new Date(),
      updatedAt: new Date(),
      ...definition,
      cronTime: null,
      deleteAt: null,
      error: null,
      id: jobID,
      lastFailedAt: null,
      lastFailedReason: null,
      lastRunAt: null,
      lastSucceedAt: null,
      lockDurationMs: definition?.lockDurationMs ?? 1000 * 30,
      name: jobName,
      nextRunAt: null,
      props: jobProps ?? null,
      unlockAt: null,
    };
  }

  static clone<T>(def: Partial<ScheduledJob> = {}): Job<T> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
    const job = new (this as any)() as Job<T>;
    job.updateInternal(def);
    return job;
  }

  onError(error: Error): Promise<void> | void {
    this.logger.error(
      'Job error: name=%s, ID=%s',
      this.jobName,
      this.jobID,
      error,
    );
  }

  onFinish(): Promise<void> | void {
    this.logger.debug('Job finished: name=%s, ID=%s', this.jobName, this.jobID);
  }

  updateInternal(def: Partial<ScheduledJob>) {
    this._internal = {
      ...this._internal,
      ...def,
    };
  }

  get definition() {
    return this._internal;
  }

  get isCronJob() {
    return !isNil(this.definition.cronTime);
  }

  get jobID() {
    return this._internal.id;
  }

  get jobName() {
    return this.constructor.name;
  }

  protected get logger() {
    return Logger.getSubLogger({
      name: this.constructor.name,
    });
  }

  abstract onProcess(props: Props): Promise<void>;
}
