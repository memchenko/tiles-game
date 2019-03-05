import IO from './IO';

export const getElement = selector =>  new IO(() => {
  return document.querySelector(selector);
});

export const get2DContext = canvasElement => new IO(() => {
  return canvasElement.getContent('2d');
});
