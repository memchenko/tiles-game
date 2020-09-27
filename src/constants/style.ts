const getCSSVariable = (name: string) =>
    getComputedStyle(document.documentElement).getPropertyValue(name);

export const COLOR_PRIMARY = () => getCSSVariable('--color-primary');

export const COLOR_SECONDARY = () => getCSSVariable('--color-secondary');

export const COLOR_THIRDLY = () => getCSSVariable('--color-thirdly');

export const COLOR_STAR = () => getCSSVariable('--color-star');

export const COLOR_BG = () => getCSSVariable('--color-bg');
