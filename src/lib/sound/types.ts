export enum SoundTypes {
    Background,
    Moving,
    Click,
    ResultSuccess,
    ResultFailure,
}

export interface ISoundPlayer {
    start(type: SoundTypes): void;
    stop(type: SoundTypes): void;
}
