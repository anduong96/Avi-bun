import { Logger } from './logger';

export function Singleton<T>() {
  return class Singleton {
    static _instance: T;

    protected constructor() {}

    static get instance(): T {
      if (!this._instance) {
        this._instance = new this() as T;
      }

      return this._instance;
    }

    get logger() {
      return Logger.getSubLogger({
        name: this.constructor.name,
      });
    }
  };
}
