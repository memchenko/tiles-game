import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import Layout from '../../components/Layout';
import { IconTypes } from '../../components/Icon';
import { PerformanceTypes } from '../../constants/game';

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
            wow
        </Layout>
    );
}
