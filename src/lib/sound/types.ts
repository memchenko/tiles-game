export enum SoundTypes {
    Moving,
    Click,
    ResultSuccess,
}

export interface ISoundPlayer {
    start(type: SoundTypes): void;
    stop(type: SoundTypes): void;
}
