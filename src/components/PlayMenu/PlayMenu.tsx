import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import './PlayMenu.scss';

import { AppRoutes } from '../../constants/urls';
import Menu from '../Menu';

export default function PlayMenu() {
    const history = useHistory();
    const goHome = useCallback(() => {
        history.push(AppRoutes.Root);
    }, []);
    const goRetry = useCallback(() => {
        history.push(AppRoutes.Play, { isRefersh: true, });
    }, []);
    const goContinue = useCallback(() => {
        history.push(AppRoutes.Play);
    }, []);

    return (
        <Menu
            list={[
                { text: 'Home', onClick: goHome },
                { text: 'Retry', onClick: goRetry },
                { text: 'Continue', onClick: goContinue },
            ]}
        />
    );
}
