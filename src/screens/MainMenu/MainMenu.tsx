import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { view } from 'ramda';

import './MainMenu.scss';

import { AppRoutes } from '../../constants/urls';
import Layout from '../../components/Layout';
import Menu from '../../components/Menu';
import { playLens, setLevel, setUnsolved } from '../../entities/play';

export default function MainMenu() {
    const history = useHistory();
    const { level, isSolved } = useSelector(view(playLens));
    const dispatch = useDispatch();

    const goCredits = useCallback(() => {
        history.push(AppRoutes.Credits);
    }, []);
    const goNew = useCallback(() => {
        dispatch(setLevel({ level: 0 }));
        history.push(AppRoutes.Play);
    }, []);
    const goPlay = useCallback(() => {
        if (level === 0 && isSolved) {
            dispatch(setUnsolved());
        }

        history.push(AppRoutes.Play);
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