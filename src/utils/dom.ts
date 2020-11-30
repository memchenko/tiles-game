import { IO } from './IO';

export const getElement = (selector: string) => new IO(() => {
  return document.querySelector(selector);
});
