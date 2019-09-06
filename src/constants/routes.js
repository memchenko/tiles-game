import { PUZZLES_TYPES } from './game';

const { BW, MONOCHROME, COLORFUL } = PUZZLES_TYPES;

export const HOME = '/';
export const PLAY = '/play';
export const SCENARIO = '/scenario';

export const PLAY_PUZZLE_ROUTE = `${PLAY}/:puzzleType`;
export const PLAY_ROUTES = {
    [BW]: `${PLAY}/black-n-white`,
    [MONOCHROME]: `${PLAY}/monochrome`,
    [COLORFUL]: `${PLAY}/colorful`
};

export const SCENARIO_DETAILS = `${SCENARIO}/:scenarioId/details`;
export const SCENARIO_MAP = `${SCENARIO}/:scenarioId/map`;
export const SCENARIO_PLAY = `${SCENARIO}/:scenarioId/play/:stepNumber`;