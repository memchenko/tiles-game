const getCSSVariable = (name: string) =>
    getComputedStyle(document.documentElement).getPropertyValue(name);

export const getPrimaryColor = () => getCSSVariable('--color-primary');

export const getSecondaryColor = () => getCSSVariable('--color-secondary');

export const getThirdlyColor = () => getCSSVariable('--color-thirdly');

export const getStarColor = () => getCSSVariable('--color-star');

export const getBgColor = () => getCSSVariable('--color-bg');
