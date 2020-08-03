import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { AppRoutes } from '../../constants/urls';
import Layout from '../../components/Layout';
import Button, { ButtonTypes, ButtonSizes, ButtonResponzivenesses } from '../../components/Button';
import './MainMenu.scss';

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
                <div className='grid-row menu__button'>
                    <div className='col-center-4'>
                        <Button
                            size={ ButtonSizes.M }
                            type={ ButtonTypes.Secondary }
                            responsiveness={ ButtonResponzivenesses.FullWide }
                            onClick={ goCredits }
                        >Credits</Button>
                    </div>
                </div>
                
                <div className='grid-row menu__button'>
                    <div className='col-center-4'>
                        <Button
                            size={ ButtonSizes.M }
                            type={ ButtonTypes.Secondary }
                            responsiveness={ ButtonResponzivenesses.FullWide }
                            onClick={ goNew }
                        >New</Button>
                    </div>
                </div>

                <div className='grid-row menu__button'>
                    <div className='col-center-6'>
                        <Button
                            size={ ButtonSizes.L }
                            type={ ButtonTypes.Primary }
                            responsiveness={ ButtonResponzivenesses.FullWide }
                            onClick={ goPlay }
                        >Play</Button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}