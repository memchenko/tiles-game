import { isMobile } from 'react-device-detect';

export const DPI = window.devicePixelRatio;

export const isLandscape = () => {
  const { width, height } = document.body.getBoundingClientRect();
  return isMobile && width > height;
};