import { range } from 'ramda';

import { Difficulties, PuzzleResult, PuzzleTypes } from '../../constants/game';

export default class Levels {
    static LEVELS = [
        Difficulties.Easy,
        Difficulties.Medium,
        Difficulties.Hard,
        Difficulties.Expert,
        Difficulties.God,
    ];

    private coefficients = {
        [Difficulties.Easy]: range(0.2, 0.4),
        [Difficulties.Medium]: range(0.3, 0.5),
        [Difficulties.Hard]: range(0.4, 0.6),
        [Difficulties.Expert]: range(0.5, 7),
        [Difficulties.God]: range(0.7, 1),
    };

    private tilesInRowNumber = {
        [Difficulties.Easy]: range(3, 4),
        [Difficulties.Medium]: range(5, 7),
        [Difficulties.Hard]: range(8, 10),
        [Difficulties.Expert]: range(11, 15),
        [Difficulties.God]: range(16, 20),
    };

    private currentState: {
        level: Difficulties;
        coefficientPointer: number;
        tilesInRowPointer: number;
    } = {
        level: Difficulties.Easy,
        coefficientPointer: 0,
        tilesInRowPointer: 0
    };

    private matrixType: PuzzleTypes | null = null;

    private successRate = 1;

    constructor({
        startLevel = Difficulties.Easy,
        startCoefficient = 0,
        startTilesInRow = 0,
        matrixType = PuzzleTypes.Monochrome,
    }: {
        startLevel?: Difficulties;
        startCoefficient?: number;
        startTilesInRow?: number;
        matrixType?: PuzzleTypes;
    } = {}) {
        this.setCurrentLevel(startLevel, startCoefficient, startTilesInRow);
        this.setMatrixType(matrixType);
    }

    updateLevels(updater: PuzzleResult) {
        if (updater === PuzzleResult.Success && this.successRate < 1) {
            this.successRate = 1;
        }

        if (updater === PuzzleResult.Failure) {
            this.successRate /= 2;
        }
    }

    updateCurrentState() {
        if (this.successRate < 0.3) {
            this.downgrade();
        }

        if (this.successRate === 1) {
            this.raise();
        }
    }

    raise() {
        const { level, coefficientPointer, tilesInRowPointer } = this.currentState;
        const coefficientsRange = this.coefficients[level];
        const tilesInRowRange = this.tilesInRowNumber[level];

        const levels = Levels.LEVELS;
        const isLastCoefficient = coefficientsRange.length === coefficientPointer + 1;
        const isLastTilesInRow = tilesInRowRange.length === tilesInRowPointer + 1;
        const isLastLevel = level === levels[levels.length - 1];

        if (!isLastCoefficient) {
            this.setCurrentLevel(level, coefficientPointer + 1, tilesInRowPointer);
        } else if (isLastCoefficient && !isLastTilesInRow) {
            this.setCurrentLevel(level, 0, tilesInRowPointer + 1);
        } else if (isLastCoefficient && isLastTilesInRow && !isLastLevel) {
            const nextLevel = levels[levels.indexOf(level) + 1];
            this.setCurrentLevel(nextLevel, 0, 0);
        }
    }

    downgrade() {
        const { level, coefficientPointer, tilesInRowPointer } = this.currentState;
        const coefficientsRange = this.coefficients[level];

        const levels = Levels.LEVELS;
        const isFirstCoefficient = coefficientPointer === 0;
        const isFirstTilesInRow = tilesInRowPointer === 0;
        const isFirstLevel = level === levels[0];

        if (!isFirstCoefficient) {
            this.setCurrentLevel(level, coefficientPointer - 1, tilesInRowPointer);
        } else if (isFirstCoefficient && !isFirstTilesInRow) {
            this.setCurrentLevel(level, coefficientsRange.length - 1, tilesInRowPointer - 1);
        } else if (isFirstCoefficient && isFirstTilesInRow && !isFirstLevel) {
            const prevLevel = levels[levels.indexOf(level) - 1];
            const prevLevelCoefficientsRange = this.coefficients[prevLevel];
            const prevTilesInRowRange = this.tilesInRowNumber[prevLevel];
            this.setCurrentLevel(prevLevel, prevLevelCoefficientsRange.length - 1, prevTilesInRowRange.length - 1);
        }
    }

    setCurrentLevel(
        level: Difficulties,
        coefficientPointer: number,
        tilesInRowPointer: number,
    ) {
        this.currentState = {
            level, coefficientPointer, tilesInRowPointer
        };
    }

    setMatrixType(type: PuzzleTypes) {
        this.matrixType = type;
    }

    getMatrixParams() {
        const { level, coefficientPointer, tilesInRowPointer } = this.currentState;
        const rows = this.tilesInRowNumber[level][tilesInRowPointer];
        const cols = rows;
        const coeffiecient = this.coefficients[level][coefficientPointer];

        return [cols, rows, coeffiecient];
    }
}