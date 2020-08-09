import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import './PlayMenu.scss';

import Button, {
    ButtonSizes,
    ButtonTypes,
    ButtonResponzivenesses,
} from '../Button';
import { AppRoutes } from '../../constants/urls';

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
        <div className='play-menu'>
            <div className='grid-row play-menu__button'>
                <div className='col-center-4'>
                    <Button
                        size={ ButtonSizes.M }
                        type={ ButtonTypes.Secondary }
                        responsiveness={ ButtonResponzivenesses.FullWide }
                        onClick={ goHome }
                    >Home</Button>
                </div>
            </div>
            
            <div className='grid-row play-menu__button'>
                <div className='col-center-4'>
                    <Button
                        size={ ButtonSizes.M }
                        type={ ButtonTypes.Secondary }
                        responsiveness={ ButtonResponzivenesses.FullWide }
                        onClick={ goRetry }
                    >Retry</Button>
                </div>
            </div>

            <div className='grid-row play-menu__button'>
                <div className='col-center-6'>
                    <Button
                        size={ ButtonSizes.L }
                        type={ ButtonTypes.Primary }
                        responsiveness={ ButtonResponzivenesses.FullWide }
                        onClick={ goContinue }
                    >Continue</Button>
                </div>
            </div>
        </div>
    );
}
