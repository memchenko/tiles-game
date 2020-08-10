import React from 'react';

import { IShareCardProps } from './types';
import './ShareCard.scss';

import TilesGrid from '../../components/TilesGrid';
import Icon, { IconTypes } from '../../components/Icon';
import { Results } from '../../constants/game';

const STARS_NUMBER = {
    [Results.Normal]: 1,
    [Results.Good]: 2,
    [Results.Best]: 3,
};

export default function ShareCard({
    performance,
    text,
    matrix,
}: IShareCardProps) {
    const filledStarsNumber = STARS_NUMBER[performance];

    return (
        <div className="share-card">
            <div className="share-card__header">TILO</div>
            <div className="share-card__body">
                <div className="share-card__grid">
                    <TilesGrid matrix={ matrix } />
                </div>
                <div className="share-card__info">
                    <div className="share-card__stars">
                        {
                            Array.from({ length: 3 }, (_, i) => (
                                <Icon
                                    key={ i }
                                    type={
                                        i < filledStarsNumber
                                            ? IconTypes.Star
                                            : IconTypes.StarEmpty
                                    }
                                />
                            ))
                        }
                    </div>
                    <div className="share-card__text">{ text }</div>
                </div>
            </div>
        </div>
    );
}
