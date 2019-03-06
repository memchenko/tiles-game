import { compose } from 'ramda';
import { of, map, ap } from 'fantasy-land';

export default class IO {
  unsafePerformIO = null;

  constructor(f) {
    this.unsafePerformIO = f;
  }

  [of](x) {
    return new IO(() => x);
  }

  [map](f) {
    return new IO(compose(f, this.unsafePerformIO));
  }

  [ap](otherContainer) {
    return otherContainer[map](this.unsafePerformIO);
  }

  toString() {
    return `IO ${this.unsafePerformIO}`;
  }
}
