import { curry } from 'ramda';
import BezierEasing from 'bezier-easing';

// distance between dot of a function line and identity line
export const getDistBetwFuncDotAndIdentityLine = curry(
  (f: ((x: number) => number), x1: number): number => {
    const y1 = f(x1);
    const x2 = (x1 + y1) / 2;
    // y2 = x2 => we don't need y2 as variable here
    return Math.sqrt(((x2 - x1) ** 2 + (x2 - x1) ** 2));
  }
);

export const getArrOfDistancesFromBezierToIdentity = (intervalsNumber: number) => {
  // the values for bezier found with http://greweb.me/bezier-easing-editor/example/
  const easing = BezierEasing(0.01, 0.74, 0.30, 0.67);
  const getCoefficients = getDistBetwFuncDotAndIdentityLine(easing);
  const divider = intervalsNumber - 1;
  return Array.from(
    { length: intervalsNumber },
    (_, i) => getCoefficients(i / divider)
  );
};

export function* loop(from: number, to: number): Generator<number, number, unknown> {
  let current = from;

  while (true) {
    yield current;

    current++;

    if (current > to) {
      current = from;
    }
  }
}
