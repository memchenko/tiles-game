import { compose } from 'ramda';
import { of, map, ap, chain } from 'fantasy-land';

export default class IO {
  constructor(f) {
    this.unsafePerformIO = f;
  }

  static performIO(io) {
    io.unsafePerformIO();
  }

  static [of](x) {
    return new IO(() => x);
  }

  [map](f) {
    return new IO(compose(f, this.unsafePerformIO));
  }

  [ap](f) {
    return this[chain](fn => f[map](fn));
  }

  [chain](fn) {
    return this[map](fn).join();
  }

  join() {
    return new IO(() => {
      return this.unsafePerformIO().unsafePerformIO();
    });
  }

  toString() {
    return `IO ${this.unsafePerformIO}`;
  }
}
