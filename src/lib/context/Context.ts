import { IPushable, IPullable } from '../interfaces/push-pull';
import { ISubscribable } from '../interfaces/pub-sub';

export class Context<T> implements ISubscribable<'push' | 'pull', T>, IPushable<T>, IPullable<T, T> {
  private data: T = {} as T;

  private listeners = {
    push: [] as ((data: Partial<T>) => void)[],
    pull: [] as ((data: T) => Promise<Partial<T>>)[],
  };

  constructor() {
    this.pull = this.pull.bind(this);
    this.push = this.push.bind(this);
    this.on = this.on.bind(this);
    this.off = this.off.bind(this);
    this.getData = this.getData.bind(this);
  }

  async pull() {
    for (let fn of this.listeners.pull) {
      Object.assign(this.data, await fn(this.data));
    }

    return Promise.resolve(this.data);
  }

  push(data: Partial<T>) {
    Object.assign(this.data, data);

    this.listeners.push.forEach((fn) => {
      fn(this.data);
    });
  }

  on(method: 'push', fn: (data: T) => void): void;
  on(method: 'pull', fn: (data: T) => Promise<Partial<T>>): void;
  on(method: 'push' | 'pull', fn: any) {
    this.listeners[method].push(fn);
  }

  off(fn: Function) {
    this.listeners.push = this.listeners.push.filter(item => item !== fn);
    this.listeners.pull = this.listeners.pull.filter(item => item !== fn);
  }

  getData() {
    return this.data;
  }
}
