import { BW, MONOCHROME, COLORFUL } from './puzzles-types';

export const HOME = '/';
export const PLAY = '/play';
export const CAMPAIGN = '/campaign';

export const PLAY_PUZZLE_ROUTE = `${PLAY}/:puzzleType`;
export const PLAY_ROUTES = {
    [BW]: `${PLAY}/black-n-white`,
    [MONOCHROME]: `${PLAY}/monochrome`,
    [COLORFUL]: `${PLAY}/colorful`
};
export const CAMPAIGN_GAME = `${CAMPAIGN}/:puzzleId`;
