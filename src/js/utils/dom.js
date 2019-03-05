import IO from './IO';

export const getElement = (selector) => {
  return new IO(() => {
    return document.querySelector(selector);
  });
};

export const get2DContext = (canvasElement) => {
  return new IO(() => {
    return canvasElement.getContent('2d');
  });
};
