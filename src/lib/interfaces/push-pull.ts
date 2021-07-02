export interface IPushable<T> {
  push(data: Partial<T>): void;
}

export interface IPullable<I, O> {
  pull(data: I): Promise<Partial<O>>;
}
