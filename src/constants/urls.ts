export enum AppRoutes {
    Root = '/',
    Credits = '/credits',

    Play = '/play',
    PlayMenu = '/play/menu',
    PlayResult = '/play/result',
}

export const BASE_URL = `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}`;
export const API = process.env.REACT_APP_API_ENDPOINT;
export enum ApiPaths {};
