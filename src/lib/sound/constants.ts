import { SoundTypes } from './types';

import { BASE_URL } from '../../constants/urls';

export const SOUND_TYPE_TO_PATH = {
  // https://freesound.org/people/florian_reinke/sounds/63533/
  [SoundTypes.Moving]: `${BASE_URL}/sounds/click.wav`,
  [SoundTypes.Click]: `${BASE_URL}/sounds/click.wav`,
  // https://freesound.org/people/plasterbrain/sounds/397354/
  [SoundTypes.ResultSuccess]: `${BASE_URL}/sounds/success.flac`,
};

export const LOOPABLE = {
  [SoundTypes.Moving]: false,
  [SoundTypes.Click]: false,
  [SoundTypes.ResultSuccess]: false,
};

export const FADEABLE = {
  [SoundTypes.Moving]: false,
  [SoundTypes.Click]: false,
  [SoundTypes.ResultSuccess]: false,
};

export const VOLUME = {
  [SoundTypes.Moving]: 0.3,
  [SoundTypes.Click]: 0.3,
  [SoundTypes.ResultSuccess]: 0.6,
};