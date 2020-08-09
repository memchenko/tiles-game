import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import './MainMenu.scss';

import { AppRoutes } from '../../constants/urls';
import Layout from '../../components/Layout';
import Menu from '../../components/Menu';

export default function MainMenu() {
    const history = useHistory();
    const goCredits = useCallback(() => {
        history.push(AppRoutes.Credits);
    }, []);
    const goNew = useCallback(() => {
        history.push(AppRoutes.Play, { isNew: true });
    }, []);
    const goPlay = useCallback(() => {
        history.push(AppRoutes.Play);
    }, []);

    return (
        <Layout>
            <div className='row-5 y-center x-center logo'>
                TILO
            </div>
            
            <div className='row-3 menu'>
                <Menu
                    list={[
                        { text: 'Credits', onClick: goCredits },
                        { text: 'New', onClick: goNew },
                        { text: 'Play', onClick: goPlay },
                    ]}
                />
            </div>
        </Layout>
    );
}