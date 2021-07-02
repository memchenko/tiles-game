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

    matrix: string[][];
    shuffledMatrix: string[][];

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
    onMatrixChange(value: string[][]): void;
    onShareCardDraw: (blob: Blob | null) => void;
    onTimerUpdate: (seconds: number) => void;
}