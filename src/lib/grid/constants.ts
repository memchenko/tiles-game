import { States, IPoint } from './types';
import { Directions } from '../../constants/game';

export const states = [
    States.Initialized,
    States.Moving,
    States.Finishing,
    States.DriveUp,
];

export const directionCoordMap: {
    [key: string]: keyof IPoint;
} = {
    [Directions.X]: 'x',
    [Directions.Y]: 'y',
};