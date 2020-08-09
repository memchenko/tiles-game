export enum AppRoutes {
    Root = '/',
    Credits = '/credits',

    Play = '/play',
    PlayMenu = '/play/menu',

    Scenario = '/scenario',
    
    PlayPuzzle = '/play/:puzzleType',
    PlayBW = '/play/bnw',
    PlayMonochrome = '/play/monochrome',
    PlayColorful = '/play/colorful',

    ScenarioDetails = '/scenario/:scenarioId/details',
    ScenarioMap = '/scenario/:scenarioId/map',
    ScenarioPlay = '/scenario/:scenarioId/play/:stepId',
}

export const BASE_URL = `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}`;
export const API = process.env.REACT_APP_API_ENDPOINT;
export enum ApiPaths {
    Token = '/token',
};
export enum AssetsPaths {
    Map = '/assets/maps/:scenarioId.html',
}