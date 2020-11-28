import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { view } from 'ramda';

import './MainMenu.scss';

import { AppRoutes } from '../../constants/urls';
import { Layout } from '../../components/Layout';
import { Menu } from '../../components/Menu';
import { playLens, setLevel, setUnsolved } from '../../entities/play';
import analytics from '../../lib/analytics';

export function MainMenu() {
    const history = useHistory();
    const { level, isSolved } = useSelector(view(playLens));
    const dispatch = useDispatch();

    const goCredits = useCallback(() => {
        history.replace(AppRoutes.Credits);
    }, []);
    const goNew = useCallback(() => {
        dispatch(setLevel({ level: 0 }));
        history.replace(AppRoutes.Play);
        analytics.set('restartedTimes');
        analytics.set('maxLevels', 0);
    }, []);
    const goPlay = useCallback(() => {
        if (level === 0 && isSolved) {
            dispatch(setUnsolved());
        } else if (isSolved) {
            dispatch(setLevel({ level: level + 1 }));
        }

        history.replace(AppRoutes.Play);
    }, [level, isSolved, dispatch]);

    return (
        <Layout>
            <div className='row-5 y-center x-center logo'>
                TILO
            </div>
            
            <div className='row-3 menu'>
                {
                    level > 0
                        ? (
                            <Menu
                                list={[
                                    { text: 'Credits', onClick: goCredits },
                                    { text: 'New', onClick: goNew },
                                    { text: 'Continue', onClick: goPlay },
                                ]}
                            />
                        )
                        : (
                            <Menu
                                list={[
                                    { text: 'Credits', onClick: goCredits },
                                    { text: 'Play', onClick: goPlay },
                                ]}
                            />
                        )
                }
            </div>
        </Layout>
    );
}