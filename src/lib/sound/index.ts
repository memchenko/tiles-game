import { Howl } from 'howler';
import { Subject } from 'rxjs';
import { identity } from 'ramda';

import { ISoundPlayer, SoundTypes } from './types';

/*
https://freesound.org/search/?g=1&f=tag%3A%22piano%22&q=hip+hop&s=score+desc&advanced=0&page=3#sound
https://freesound.org/browse/tags/relax/?page=2#sound
https://freesound.org/people/plasterbrain/sounds/464923/
*/

const SOUND_TYPE_TO_PATH = {
    // https://freesound.org/people/shortiefoeva2/sounds/412048/
    [SoundTypes.Background]: `http://192.168.0.105:3030/sounds/background_reduced.mp3`, 
    [SoundTypes.Moving]: 'http://192.168.0.105:3030/sounds/moving3.mp3',
    // https://freesound.org/people/florian_reinke/sounds/63533/
    [SoundTypes.Click]: 'http://192.168.0.105:3030/sounds/click.wav',
    [SoundTypes.ResultSuccess]: 'http://192.168.0.105:3030/sounds/success.mp3',
    // [SoundTypes.ResultFailure]: './result_failure.mp3',
};

const LOOPABLE = {
    [SoundTypes.Background]: true,
    [SoundTypes.Moving]: false,
    [SoundTypes.Click]: false,
    [SoundTypes.ResultSuccess]: false,
    [SoundTypes.ResultFailure]: false,
};

const FADEABLE = {
    [SoundTypes.Background]: true,
    [SoundTypes.Moving]: false,
    [SoundTypes.Click]: false,
    [SoundTypes.ResultSuccess]: false,
    [SoundTypes.ResultFailure]: false,
};

const VOLUME = {
    [SoundTypes.Background]: 0.2,
    [SoundTypes.Moving]: 0.05,
    [SoundTypes.Click]: 0.1,
    [SoundTypes.ResultSuccess]: 0.6,
    [SoundTypes.ResultFailure]: 1,
};

class Sound implements ISoundPlayer {
    private sounds: { [key: string]: Howl; } = {};
    private loadedSounds: { [key: string]: boolean; } = Object
        .keys(SOUND_TYPE_TO_PATH)
        .reduce((acc, key) => Object.assign(
            acc,
            { [key]: false, }
        ), {});

    allSoundsLoaded$: Subject<void> = new Subject();

    constructor() {
        this.triggerAllSoundsLoaded = this.triggerAllSoundsLoaded.bind(this);

        Object.entries(SOUND_TYPE_TO_PATH).forEach(([key, path]) => {
            const config = {
                src: [path],
                loop: LOOPABLE[key as unknown as keyof typeof LOOPABLE],
                volume: VOLUME[key as unknown as keyof typeof VOLUME],
                onload: () => this.triggerAllSoundsLoaded(key),
            };

            this.sounds[key] = new Howl(config);
        });
    }

    private triggerAllSoundsLoaded(key: string) {
        this.loadedSounds[key] = true;

        const isAllLoaded = Object.values(this.loadedSounds).every(identity);

        if (isAllLoaded) {
            this.allSoundsLoaded$.complete();
        }
    }

    start(type: SoundTypes) {
        if (FADEABLE[type]) {
            this.sounds[type].fade(0, VOLUME[type], 1.5);
        }

        this.sounds[type].play();
    }

    stop(type: SoundTypes) {
        if (FADEABLE[type]) {
            this.sounds[type].fade(VOLUME[type], 0, 1.5);
        }

        this.sounds[type].stop();
    }
}

export default new Sound();

export * from './types';