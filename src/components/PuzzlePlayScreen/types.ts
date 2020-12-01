import { TileInfo } from '../../lib/grid';
import { IconTypes } from '../../components/Icon';
import { Results } from '../../constants/game';

export interface IPuzzlePlayScreenProps {
    isNative: boolean;
    isSolved: boolean;
    isSuccessfullySolved: boolean;
    isShare: boolean;
    isPlaying: boolean;
    performances: number[];
    level: number;
    result: Results;

    matrix: TileInfo[][];
    shuffledMatrix: TileInfo[][];

    leftIcon: IconTypes;
    rightIcon: IconTypes;

    shareCardText: string;
    starsNumber: number;

    onLeftIconClick(): void;
    onRightIconClick(): void;
    onHomeClick(): void;
    onRetryClick(): void;
    onBackClick(): void;
    onNextClick(): void;
    onMatrixChange(value: TileInfo[][]): void;
    onShareCardDraw: (blob: Blob | null) => void;
    onTimerUpdate: (seconds: number) => void;
}