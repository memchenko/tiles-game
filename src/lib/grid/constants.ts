import { IPoint, IStreams } from './types';
import { Directions } from '../../constants/game';

export const directionCoordMap: {
    [key: string]: keyof IPoint;
} = {
    [Directions.X]: 'x',
    [Directions.Y]: 'y',
};

export const transitions: {
    [K in IStreams]: IStreams;
} = {
    start: 'direction',
    direction: 'move',
    move: 'end',
    end: 'deceleration',
    deceleration: 'align',
    align: 'start',
};