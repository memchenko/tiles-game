import { Howl } from 'howler';
import { Subject } from 'rxjs';
import { identity } from 'ramda';

import { ISoundPlayer, SoundTypes } from './types';
import { SOUND_TYPE_TO_PATH, LOOPABLE, VOLUME, FADEABLE } from './constants';

export class Sound implements ISoundPlayer {
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
                format: path.split('.').slice(-1),
                loop: LOOPABLE[key as unknown as keyof typeof LOOPABLE],
                volume: VOLUME[key as unknown as keyof typeof VOLUME],
                onload: () => this.triggerAllSoundsLoaded(key),
                onloaderror: () => this.triggerAllSoundsLoaded(key),
            };

            this.sounds[key] = new Howl(config);
        });
    }

    private triggerAllSoundsLoaded(key: string) {
        this.loadedSounds[key] = true;

        const isAllLoaded = Object.values(this.loadedSounds).every(identity);

        if (isAllLoaded) {
            this.allSoundsLoaded$.next();
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