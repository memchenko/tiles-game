import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import useGlobalState from '_hooks/useGlobalState';
import { SCENARIOS_MAPS, SCENARIOS_RESULTS } from '_src/store/selectors';
import { shuffleMtx } from '_modules/shuffler';
import { isGridColorsMatchMtx } from '_modules/grid/calc-grid';

import TilesGrid from '_components/elements/TilesGrid/TilesGrid';
import TilesGridInteractive from '_components/elements/TilesGridInteractive/TilesGridInteractive';

function handleMatrixChange(originalMatrix, setSolved) {
    return (currentMatrix) => {
        if (isGridColorsMatchMtx(originalMatrix, currentMatrix)) {
            setSolved(true);
        }
    };
}

function ScenarioPlay({ match }) {
    const [isSolved, setSolved] = useState(false);
    const { scenarioId, stepNumber } = match.params;
    const [maps] = useGlobalState(SCENARIOS_MAPS, SCENARIOS_RESULTS);
    const scenarioMap = maps.get(+scenarioId);
    const { matrix } = scenarioMap.get(+stepNumber);

    return (
        <div>{
            isSolved
                ? 'Solved'
                : <>
                    <div style={{ width: '30%', display: 'inline-block', marginRight: 30 }}>
                        <TilesGridInteractive
                            matrix={ shuffleMtx(matrix) }
                            onMatrixChange={ handleMatrixChange(matrix, setSolved) }
                        />
                    </div>
                    <div style={{ width: '20%', display: 'inline-block' }}>
                        <TilesGrid
                            matrix={ matrix }
                        />
                    </div>
                </>
        }</div>
    );
}

ScenarioPlay.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            scenarioId: PropTypes.string.isRequired,
            stepNumber: PropTypes.string.isRequired
        }).isRequired
    }).isRequired
};

export default withRouter(ScenarioPlay);
