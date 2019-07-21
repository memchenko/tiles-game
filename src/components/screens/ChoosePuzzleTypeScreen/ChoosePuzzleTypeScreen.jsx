import React from 'react';
import { Link } from 'react-router-dom';
import { generateMonochromeMatrix } from '_modules/matrices-generator/matrices-generator';
import * as PUZZLES_TYPES from '_constants/puzzles-types';
import { PLAY_ROUTES } from '_constants/routes';

import TilesGrid from '_components/blocks/TilesGrid/TilesGrid';

const matrices = {
    [PUZZLES_TYPES.BW]: [['#000000', '#ffffff'], ['#ffffff', '#000000']],
    [PUZZLES_TYPES.MONOCHROME]: generateMonochromeMatrix(2, 2, 1, '#dd5500'),
    [PUZZLES_TYPES.COLORFUL]: [['#ff4900', '#0b61a4'], ['#ff9200', '#00af64']]
};

const titles = {
    [PUZZLES_TYPES.BW]: 'Black\'n\'White puzzles',
    [PUZZLES_TYPES.MONOCHROME]: 'Monochrome puzzles',
    [PUZZLES_TYPES.COLORFUL]: 'Colorful puzzles'
};

const links = {
    [PUZZLES_TYPES.BW]: { pathname: PLAY_ROUTES[PUZZLES_TYPES.BW] },
    [PUZZLES_TYPES.MONOCHROME]: { pathname: PLAY_ROUTES[PUZZLES_TYPES.MONOCHROME], state: '#ff4444' },
    [PUZZLES_TYPES.COLORFUL]: { pathname: PLAY_ROUTES[PUZZLES_TYPES.COLORFUL] }
};

export default function ChoosePuzzleTypeScreen() {
    return (
        <ul>
            {
                Object.values(PUZZLES_TYPES).map(puzzleType => (
                    <li key={ puzzleType }>
                        <span>{ titles[puzzleType] }</span>
                        <Link to={ links[puzzleType] }>
                            <div style={{ width: 200, height: 200 }}>
                                <TilesGrid matrix={ matrices[puzzleType] } />
                            </div>
                        </Link>
                    </li>
                ))
            }
        </ul>
    );
}
