export enum AppRoutes {
    Root = '/',
    Play = '/play',
    Scenario = '/scenario',
    
    PlayPuzzle = '/play/:puzzleType',
    PlayBW = '/play/bnw',
    PlayMonochrome = '/play/monochrome',
    PlayColorful = '/play/colorful',

    ScenarioDetails = '/scenario/:scenarioId/details',
    ScenarioMap = '/scenario/:scenarioId/map',
    ScenarioPlay = '/scenario/:scenarioId/play/:stepNumber',
}

export const BASE_URL = 'http://localhost:3000';
export const API = '/api/0.0.1';
export const enum ApiPaths {
    Token = '/token',
};
