import { TileInfo } from '../../lib/grid/types';
import { IconTypes } from '../../components/Icon';

export interface IPuzzlePlayScreenProps {
    isSolved: boolean;
    isShare: boolean;
    isPlaying: boolean;
    performances: number[];
    timerValue: number;

    matrix: TileInfo[][];
    shuffledMatrix: TileInfo[][];

    leftIcon: IconTypes;
    rightIcon: IconTypes;

    onLeftIconClick(): void;
    onRightIconClick(): void;
    onHomeClick(): void;
    onRetryClick(): void;
    onBackClick(): void;
    onNextClick(): void;
    onMatrixChange(value: TileInfo[][]): void;
}