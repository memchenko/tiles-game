import { compose } from 'ramda';

export default class IO {
  unsafePerformIO = null;

  constructor(f) {
    this.unsafePerformIO = f;
  }

  of(x) {
    return new IO(() => x);
  }

  map(f) {
    return new IO(compose(f, this.unsafePerformIO));
  }
}
