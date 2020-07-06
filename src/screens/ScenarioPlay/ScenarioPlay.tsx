import React, { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { isMatricesEqual } from '../../lib/grid/calc-grid';
import { shuffleMtx } from '../../lib/shuffle';
import { getMapByScenarioId } from '../../entities/map';
import TilesGrid from '../../components/TilesGrid';
import TilesGridInteractive from '../../components/TilesGridInteractive';
import { TileInfo } from '../../lib/grid/types';

export default function ScenarioPlay() {
    const [isSolved, setSolved] = useState(false);
    const { scenarioId, stepId } = useParams();
    const scenarioMap = useSelector(getMapByScenarioId(scenarioId));
    const step = scenarioMap.find(({ id }) => id === stepId);

    if (!step) {
        throw new Error(`No step with id: ${stepId} in scenario with id: ${scenarioId}`);
    }

    const { matrix } = step;
    const handleMatrixChange = useCallback((currentMatrix: TileInfo[][]) => {
        if (isMatricesEqual(matrix, currentMatrix)) {
            setSolved(true);
        }
    }, [matrix]);

    return (
        <div>{
            isSolved
                ? 'Solved'
                : <>
                    <div style={{ width: '30%', display: 'inline-block', marginRight: 30 }}>
                        <TilesGridInteractive
                            matrix={ shuffleMtx(matrix) }
                            onMatrixChange={ handleMatrixChange }
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
