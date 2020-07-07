import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { __, curry } from 'ramda';

import {
    generateBWMatrix,
    generateMonochromeMatrix,
    generateColorfulMatrix
} from '../../lib/matrices-generator/matrices-generator';
import { AppRoutes } from '../../constants/urls';
import TilesGrid from '../../components/TilesGrid';
import TilesGridInteractive from '../../components/TilesGridInteractive';
import { TileInfo } from '../../lib/grid/types';

const routeMatricesMap = (color: string) => {
    return {
        [AppRoutes.PlayBW]: generateBWMatrix,
        [AppRoutes.PlayMonochrome]: curry(generateMonochromeMatrix)(__, __, __, color),
        [AppRoutes.PlayColorful]: generateColorfulMatrix
    };
};

function logChanges(mtx: TileInfo[][]) {
    console.log(mtx); // eslint-disable-line
}

export default function PuzzlePlay() {
    const { pathname, state } = useLocation();
    const generateMtx: any = routeMatricesMap(state as string);
    const [mtx] = useState(generateMtx[pathname](3, 3, .5) as TileInfo[][]);

    return mtx
        ? <div style={{ display: 'flex' }}>
            <div style={{ width: '70%' }}>
                <TilesGridInteractive matrix={mtx} onMatrixChange={logChanges} />
            </div>
            <div style={{ width: '30%' }}>
                <TilesGrid matrix={mtx} />
            </div>
        </div>
        : null;
}
