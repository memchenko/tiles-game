import { range } from 'ramda';

export default class Levels {
    static LEVELS = {
        EASY: 'EASY',
        MEDIUM: 'MEDIUM',
        HARD: 'HARD',
        EXPERT: 'EXPERT'
    };

    static MATRICES_TYPES = {
        SINGLE_COLOR: 'SINGLE_COLOR',
        COLORFUL: 'COLORFUL'
    };

    static UPDATERS = {
        SUCCESS: 'SUCCESS',
        FAIL: 'FAIL'
    };

    _coefficients = {
        [Levels.LEVELS.EASY]: range(0.4, 0.6),
        [Levels.LEVELS.MEDIUM]: range(0.3, 0.7),
        [Levels.LEVELS.HARD]: range(0.4, 0.8),
        [Levels.LEVELS.EXPERT]: range(0.5, 1)
    };

    _tilesInRowNumber = {
        [Levels.LEVELS.EASY]: range(3, 4),
        [Levels.LEVELS.MEDIUM]: range(5, 7),
        [Levels.LEVELS.HARD]: range(8, 10),
        [Levels.LEVELS.EXPERT]: range(11, 15)   
    };

    _currentState = {
        level: Levels.LEVELS.EASY,
        coefficientPointer: 0,
        tilesInRowPointer: 0
    };

    _matrixType = null;

    _successRate = 1;

    constructor({
        startLevel = 'EASY',
        startCoefficient = 0,
        startTilesInRow = 0,
        matrixType = 'SINGLE_COLOR'
    } = {}) {
        this.setCurrentLevel(startLevel, startCoefficient, startTilesInRow);
        this.setMatrixType(matrixType);
    }

    updateLevels(updater) {
        if (updater === Levels.UPDATERS.SUCCESS && this._successRate < 1) {
            this._successRate = 1;
        }

        if (updater === Levels.UPDATERS.FAIL) {
            this._successRate /= 2;
        }
    }

    updateCurrentState() {
        if (this._successRate < 0.3) {
            this.downgrade();
        }

        if (this._successRate === 1) {
            this.raise();
        }
    }

    raise() {
        const { level, coefficientPointer, tilesInRowPointer } = this._currentState;
        const coefficientsRange = this._coefficients[level];
        const tilesInRowRange = this._tilesInRowNumber[level];

        const levels = Object.keys(Levels.LEVELS);
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
        const { level, coefficientPointer, tilesInRowPointer } = this._currentState;
        const coefficientsRange = this._coefficients[level];

        const levels = Object.keys(Levels.LEVELS);
        const isFirstCoefficient = coefficientPointer === 0;
        const isFirstTilesInRow = tilesInRowPointer === 0;
        const isFirstLevel = level === levels[0];

        if (!isFirstCoefficient) {
            this.setCurrentLevel(level, coefficientPointer - 1, tilesInRowPointer);
        } else if (isFirstCoefficient && !isFirstTilesInRow) {
            this.setCurrentLevel(level, coefficientsRange.length - 1, tilesInRowPointer - 1);
        } else if (isFirstCoefficient && isFirstTilesInRow && !isFirstLevel) {
            const prevLevel = levels[levels.indexOf(level) - 1];
            const prevLevelCoefficientsRange = this._coefficients[prevLevel];
            const prevTilesInRowRange = this._tilesInRowNumber[prevLevel];
            this.setCurrentLevel(prevLevel, prevLevelCoefficientsRange.length - 1, prevTilesInRowRange - 1);
        }
    }

    setCurrentLevel(level, coefficientPointer, tilesInRowPointer) {
        this._currentState = {
            level, coefficientPointer, tilesInRowPointer
        };
    }

    setMatrixType(type) {
        this._matrixType = type;
    }

    getMatrixParams() {
        const { level, coefficientPointer, tilesInRowPointer } = this._currentState;
        const rows = this._tilesInRowNumber[level][tilesInRowPointer];
        const cols = rows;
        const coeffiecient = this._coefficients[level][coefficientPointer];

        return [cols, rows, coeffiecient];
    }
}