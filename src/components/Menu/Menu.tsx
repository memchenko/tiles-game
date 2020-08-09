import React from 'react';

import { IMenuProps } from './types';
import './Menu.scss';

import Button, {
    ButtonSizes,
    ButtonTypes,
    ButtonResponzivenesses,
} from '../Button';

export default function Menu({ list }: IMenuProps) {
    return (
        <div className='menu'>
            {
                list.slice(0, list.length - 1).map(({ text, onClick }) => (
                    <div key={ text } className='grid-row menu__button'>
                        <div className='col-center-4'>
                            <Button
                                size={ ButtonSizes.M }
                                type={ ButtonTypes.Secondary }
                                responsiveness={ ButtonResponzivenesses.FullWide }
                                onClick={ onClick }
                            >{ text }</Button>
                        </div>
                    </div>
                ))
            }
            <div className='grid-row menu__button'>
                <div className='col-center-6'>
                    <Button
                        size={ ButtonSizes.L }
                        type={ ButtonTypes.Primary }
                        responsiveness={ ButtonResponzivenesses.FullWide }
                        onClick={ list[list.length - 1].onClick }
                    >{ list[list.length - 1].text }</Button>
                </div>
            </div>
        </div>
    );
}
