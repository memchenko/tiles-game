import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { __, curry } from 'ramda';

import {
    generateBWMatrix,
    generateMonochromeMatrix,
    generateColorfulMatrix
} from '_modules/matrices-generator/matrices-generator';
import { PLAY_ROUTES } from '_constants/routes';

import TilesGrid from '_components/elements/TilesGrid/TilesGrid';
import TilesGridInteractive from '_components/elements/TilesGridInteractive/TilesGridInteractive';

const routeMatricesMap = (color) => {
    return {
        [PLAY_ROUTES.BW]: generateBWMatrix,
        [PLAY_ROUTES.MONOCHROME]: curry(generateMonochromeMatrix)(__, __, __, color),
        [PLAY_ROUTES.COLORFUL]: generateColorfulMatrix
    };
};

function logChanges(mtx) {
    console.log(mtx); // eslint-disable-line
}

function PlayScreen({ location: { pathname, state }}) {
    const generateMtx = routeMatricesMap(state);
    const [mtx] = useState(generateMtx[pathname](3, 3, .5));

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

PlayScreen.propTypes = {
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
        state: PropTypes.string
    }).isRequired,
    match: PropTypes.shape({
        params: PropTypes.shape({
            puzzleType: PropTypes.string.isRequired
        }).isRequired
    }).isRequired
};

export default withRouter(PlayScreen);
