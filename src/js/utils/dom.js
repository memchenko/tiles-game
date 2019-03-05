import IO from './IO';

export const getElement = (selector) => {
  return new IO(() => {
    return document.querySelector(selector);
  });
};
