const getRandomId = () => (Date.now() + Math.trunc(Math.random() * 10000)).toString(36);

export const Puzzle = ({ id = getRandomId(), title, levelId }) => ({
    id,
    title,
    levelId
});

export const Matrix = ({ puzzleId, matrix }) => ({
    puzzleId, matrix
});

export const PuzzleState = ({ id = getRandomId(), title }) => ({
    id, title
});

export const PuzzleCurrentState = ({ puzzleId, stateId }) => ({
    puzzleId, stateId
});

export const Level = ({ id = getRandomId(), title }) => ({
    id, title
});

export const GameIndicator = ({ id = getRandomId(), title }) => ({
    id, title
});

export const GameMetrics = ({ id = getRandomId(), indicatorId, value }) => ({
    id, indicatorId, value
});

export const Settings = ({ id = getRandomId(), title, value }) => ({
    id, title, value
});

export const MarketingIndicator = ({ id = getRandomId(), title }) => ({
    id, title
});

export const MarketingMetrics = ({
    id = getRandomId(),
    indicatorId,
    timestamp = Date.now(),
    value
}) => ({
    id, indicatorId, timestamp, value
});
