import React, { useEffect, useRef, useCallback } from 'react';
import { Switch } from 'react-router-dom';
import cn from 'classnames';

import './PuzzlePlayScreen.scss';
import { IPuzzlePlayScreenProps } from './types';

import { Layout } from '../Layout';
import { Icon, IconTypes } from '../Icon';
import { PerformanceTypes } from '../../constants/game';
import { TilesGrid } from '../TilesGrid';
import { TilesGridInteractive } from '../TilesGridInteractive';
import { AppRoutes } from '../../constants/urls';
import { Menu } from '../Menu';
import { ShareCard } from '../ShareCard';
import { formatSeconds } from '../../utils/time';
import { OpenIfInited } from '../OpenIfInited';
import { Performance } from '../Performance';
import { TimePerformance } from '../TimePerformance';

export function PuzzlePlayScreen({
    isNative,
    isSolved,
    isShare,
    isPlaying,
    isSuccessfullySolved,
    performances,
    level,
    result,
    matrix,
    shuffledMatrix,
    leftIcon,
    rightIcon,
    shareCardText,
    starsNumber,
    onLeftIconClick,
    onRightIconClick,
    onHomeClick,
    onRetryClick,
    onBackClick,
    onNextClick,
    onMatrixChange,
    onShareCardDraw,
    onTimerUpdate,
}: IPuzzlePlayScreenProps) {
    const seconds = useRef(0);
    const filledStars = Array.from({ length: starsNumber }, () => IconTypes.Star);
    const emptyStars = Array.from({ length: 3 - starsNumber }, () => IconTypes.StarEmpty);
    const stars = filledStars
        .concat(emptyStars)
        .map((iconType: IconTypes, i: number) => (<Icon key={ i } type={ iconType } />));
    const handleTimerUpdate = useCallback((value: number) => {
        seconds.current = value;

        onTimerUpdate(value);
    }, [seconds, onTimerUpdate]);

    useEffect(() => {
        if (!isSolved) {
            seconds.current = 0;
        }
    }, [isSolved, seconds]);

    return (
        <Layout
            headerProps={{
                render: !isSolved
                    ? () => <TimePerformance onUpdate={ handleTimerUpdate } />
                    : () => (
                        <Performance
                            performanceType={ PerformanceTypes.Time }
                            performanceValue={ formatSeconds(seconds.current) }/>
                    ),
                leftIconType: leftIcon,
                rightIconType: rightIcon,
                onLeftIconClick,
                onRightIconClick,
            }}
        >
            <div className={ cn('grid-row', {
                'row-3': !isShare,
                'row-5': isShare,
            }) }>
                <div className={ cn('col-center-2', 'play-example', 'y-center', {
                    undisplay: isShare,
                }) }>
                    <TilesGrid matrix={ matrix } />
                    <div className="play-level">
                        LEVEL { level }
                    </div>
                </div>
                {
                    isNative
                        ? (
                            <div className={ cn('play-share', {
                                'play-share--invisible': !isShare
                            }) }>
                                <ShareCard
                                    performance={ result }
                                    matrix={ matrix }
                                    text={ shareCardText }
                                    level={ level }
                                    onDraw={ onShareCardDraw }
                                />
                            </div>
                        )
                        : null
                }
            </div>
            <div className={ cn('play-area', {
                'play-area--centered': isPlaying,
                'row-5': !isShare,
                'row-3': isShare,
            }) }>
                <Switch>
                    <OpenIfInited
                        path={ AppRoutes.Play }
                        exact
                        render={() => (
                            shuffledMatrix && (
                                <div className="play-area__grid">
                                    <TilesGridInteractive
                                        matrix={ shuffledMatrix! }
                                        onMatrixChange={ onMatrixChange }
                                    />
                                </div>
                            )
                        )}
                    />
                    <OpenIfInited
                        path={ AppRoutes.PlayResult }
                        render={() => (
                            <>
                                <div className={ cn('play-area__result', {
                                    undisplay: isShare,
                                }) }>
                                    <div className="play-area__stars">
                                        { stars }
                                    </div>
                                    <div className="play-area__ideal">
                                        Ideal { formatSeconds(performances[0]) }
                                    </div>
                                </div>
                                {
                                    isSuccessfullySolved
                                        ? (
                                            <Menu
                                                list={[
                                                    { text: 'Retry', onClick: onRetryClick },
                                                    { text: 'Next', onClick: onNextClick },
                                                ]}
                                            />
                                        )
                                        : (
                                            <Menu
                                                list={[
                                                    { text: 'Retry', onClick: onRetryClick },
                                                ]}
                                            />
                                        )
                                }
                            </>
                        )}
                    />
                    <OpenIfInited
                        path={ AppRoutes.PlayMenu }
                        render={() => (
                            <>
                                {
                                    isSolved && isSuccessfullySolved
                                    ? (
                                        <Menu
                                            list={[
                                                { text: 'Home', onClick: onHomeClick },
                                                { text: 'Retry', onClick: onRetryClick },
                                                { text: 'Next', onClick: onNextClick },
                                            ]}
                                        />
                                    )
                                    : isSolved && !isSuccessfullySolved 
                                    ? (
                                        <Menu
                                            list={[
                                                { text: 'Home', onClick: onHomeClick },
                                                { text: 'Retry', onClick: onRetryClick },
                                            ]}
                                        />
                                    )
                                    : (
                                        <Menu
                                            list={[
                                                { text: 'Home', onClick: onHomeClick },
                                                { text: 'Retry', onClick: onRetryClick },
                                                { text: 'Resume', onClick: onBackClick },
                                            ]}
                                        />
                                    )
                                }
                            </>
                        )}
                    />
                </Switch>
            </div>
        </Layout>
    );
}