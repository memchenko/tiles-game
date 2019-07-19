import { BW, MONOCHROME, COLORFUL } from './puzzles-types';

export const HOME = '/';
export const PLAY = '/play';
export const SCENARIO = '/scenario';

export const PLAY_PUZZLE_ROUTE = `${PLAY}/:puzzleType`;
export const PLAY_ROUTES = {
    [BW]: `${PLAY}/black-n-white`,
    [MONOCHROME]: `${PLAY}/monochrome`,
    [COLORFUL]: `${PLAY}/colorful`
};

export const SCENARIO_DETAILS = `${SCENARIO}/details`;
export const SCENARIO_MAP = `${SCENARIO}/map`;
export const SCENARIO_PLAY = `${SCENARIO}/play`;