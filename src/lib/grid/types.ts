import { Observable } from 'rxjs';

export interface TileInfo {
    image?: string;
    color?: string;
}

export interface TileConfig {
    image?: string;
    color?: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface IPoint {
    x: number;
    y: number;
}

export interface IQuadrant {
    row: number;
    column: number;
}

export enum States {
    Initialized = 'initialized',
    Moving = 'moving',
    Finishing = 'finishing',
    DriveUp = 'driveUp',
}

export interface IInteractionObservables {
    initializer: Observable<IPoint>;
    mover: Observable<IPoint>;
    finisher: Observable<void>;
}