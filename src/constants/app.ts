export enum Platforms {
    Web = 0,
    Android = 1,
    iOS = 2,
}

export const PLATFORM = parseInt(process.env.REACT_APP_PLATFORM!) as Platforms;