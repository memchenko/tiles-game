import IO from './IO';

export const getElement = selector =>  new IO(() => {
  return document.querySelector(selector);
});
