import React from 'react';
import { Link } from 'react-router-dom';
import { generateMonochromeMatrix } from '../../lib/matrices-generator/matrices-generator';
import { PuzzleTypes } from '../../constants/game';
import { AppRoutes } from '../../constants/urls';

import TilesGrid from '../../components/TilesGrid';

const matrices = {
    [PuzzleTypes.BW]: [
        [{ color: '#000000' }, { color: '#ffffff' }],
        [{ color: '#ffffff' }, { color: '#000000' }],
    ],
    [PuzzleTypes.Monochrome]: generateMonochromeMatrix(2, 2, 1, '#dd5500'),
    [PuzzleTypes.Colorful]: [
        [{ color: '#ff4900' }, { color: '#0b61a4' }],
        [{ color: '#ff9200' }, { color: '#00af64' }],
    ]
};

const titles = {
    [PuzzleTypes.BW]: 'Black\'n\'White puzzles',
    [PuzzleTypes.Monochrome]: 'Monochrome puzzles',
    [PuzzleTypes.Colorful]: 'Colorful puzzles'
};

const links = {
    [PuzzleTypes.BW]: { pathname: AppRoutes.PlayBW },
    [PuzzleTypes.Monochrome]: { pathname: AppRoutes.PlayMonochrome, state: '#ff4444' },
    [PuzzleTypes.Colorful]: { pathname: AppRoutes.PlayColorful }
};

const PUZZLES_TYPES = [PuzzleTypes.BW, PuzzleTypes.Monochrome, PuzzleTypes.Colorful];

export default function PuzzlesMenu() {
    return (
        <ul>
            {
                PUZZLES_TYPES.map((puzzleType) => (
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