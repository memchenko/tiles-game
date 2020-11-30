import { compose } from 'ramda';
import { of, map, chain } from 'fantasy-land';

export class IO {
  unsafePerformIO: (() => any);
  
  constructor(f: (() => any)) {
    this.unsafePerformIO = f;
  }

  static performIO(io: any) {
    io.unsafePerformIO();
  }

  static [of](x: any) {
    return new IO(() => x);
  }

  [map](f: any): any {
    return new IO(
      compose(
        f,
        this.unsafePerformIO
      )
    );
  }

  [chain](fn: any): any {
    return this[map](fn).join();
  }

  join(): any {
    return new IO(() => {
      return this.unsafePerformIO().unsafePerformIO();
    });
  }

  toString() {
    return `IO ${this.unsafePerformIO}`;
  }
}
