export interface ISubscribable<E extends string, T> {
  on(event: E, fn: (data: T) => void): void;
  off(fn: (data: T) => void): void;
}
