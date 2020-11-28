import React from 'react';
import { Switch } from 'react-router-dom';
import cn from 'classnames';

import './PuzzlePlayScreen.scss';
import { IPuzzlePlayScreenProps } from './types';

import Layout from '../Layout';
import Icon, { IconTypes } from '../Icon';
import { PerformanceTypes, Results } from '../../constants/game';
import TilesGrid from '../TilesGrid';
import TilesGridInteractive from '../TilesGridInteractive';
import { AppRoutes } from '../../constants/urls';
import Menu from '../Menu';
import ShareCard from '../ShareCard';
import { formatSeconds } from '../../utils/time';
import OpenIfInited from '../OpenIfInited';

export default function PuzzlePlayScreen({
    isNative,
    isSolved,
    isShare,
    isPlaying,
    performances,
    timerValue,
    level,
    matrix,
    shuffledMatrix,
    leftIcon,
    rightIcon,
    onLeftIconClick,
    onRightIconClick,
    onHomeClick,
    onRetryClick,
    onBackClick,
    onNextClick,
    onMatrixChange,
    onShareCardDraw,
}: IPuzzlePlayScreenProps) {
    const time = formatSeconds(timerValue);
    const isSuccessfullySolved = timerValue < performances[2];
    let performance = Results.Bad;

    if (timerValue <= performances[0]) {
        performance = Results.Best;
    } else if (timerValue <= performances[1]) {
        performance = Results.Good;
    } else if (timerValue <= performances[2]) {
        performance = Results.Normal;
    }

    return (
        <Layout
            headerProps={{
                leftIconType: leftIcon,
                rightIconType: rightIcon,
                onLeftIconClick,
                onRightIconClick,
                performanceType: PerformanceTypes.Time,
                performanceValue: time,
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
                                    performance={ performance }
                                    matrix={ matrix }
                                    text={ `MY TIME ${time}` }
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
                'row-2': isShare,
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
                                        {
                                            performances
                                                .map((performance: number) => timerValue > performance ? IconTypes.StarEmpty : IconTypes.Star)
                                                .reverse()
                                                .map((iconType: IconTypes, i: number) => (<Icon key={ i } type={ iconType } />))
                                        }
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