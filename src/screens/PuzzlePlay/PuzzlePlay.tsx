import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import cn from 'classnames';

import './PuzzlePlay.scss';

import Layout from '../../components/Layout';
import { IconTypes } from '../../components/Icon';
import { PerformanceTypes } from '../../constants/game';
import TilesGrid from '../../components/TilesGrid';
import TilesGridInteractive from '../../components/TilesGridInteractive';

const mtx = [
    ['#F7567C', '#5D576B', '#EDB88B'].map(color => ({ color })),
    ['#F7567C', '#5D576B', '#EDB88B'].reverse().map(color => ({ color })),
    ['#F7567C', '#5D576B', '#EDB88B'].map(color => ({ color })),
];

export default function PuzzlePlay() {
    const { state } = useLocation<{ isNew: boolean; }>();
    
    useEffect(() => {
        if (state && state.isNew) {

        }
    }, [state]);

    return (
        <Layout
            headerProps={{
                leftIconType: IconTypes.Burger,
                rightIconType: IconTypes.Refresh,
                onLeftIconClick: (event: any) => {},
                onRightIconClick: (event: any) => {},
                performanceType: PerformanceTypes.Time,
                performanceValue: '1:34',
            }}
        >
            <div className="row-1"></div>
            <div className={ cn('row-2', 'grid-row') }>
                <div className={ cn('col-center-2', 'puzzle-play-example') }>
                    <TilesGrid matrix={ mtx } />
                </div>
            </div>
            <div className={ cn('row-5', 'puzzle-play-area') }>
                <div className="puzzle-play-area__grid">
                    <TilesGridInteractive
                        matrix={ mtx }
                        onMatrixChange={ () => {} }
                    />
                </div>
            </div>
        </Layout>
    );
}
