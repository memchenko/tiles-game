import React from 'react';
import { Route, Switch } from 'react-router-dom';
import cn from 'classnames';

import './PuzzlePlayScreen.scss';
import { IPuzzlePlayScreenProps } from './types';

import Layout from '../../components/Layout';
import Icon, { IconTypes } from '../../components/Icon';
import { PerformanceTypes, Results } from '../../constants/game';
import TilesGrid from '../../components/TilesGrid';
import TilesGridInteractive from '../../components/TilesGridInteractive';
import { AppRoutes } from '../../constants/urls';
import Menu from '../../components/Menu';
import ShareCard from '../../components/ShareCard';
import { formatSeconds } from '../../utils/time';

export default function PuzzlePlayScreen({
    isSolved,
    isShare,
    isPlaying,
    performances,
    timerValue,
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
}: IPuzzlePlayScreenProps) {
    const time = formatSeconds(timerValue);
    const isSuccessfullySolved = timerValue < performances[2];
    
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
            <div className="row-1"></div>
            <div className={ cn('grid-row', {
                'row-2': !isShare,
                'row-5': isShare,
            }) }>
                <div className={ cn('col-center-2', 'play-example', {
                    undisplay: isShare,
                }) }>
                    <TilesGrid matrix={ matrix } />
                </div>
                {
                    isShare && (
                        <div className={ cn('play-share') }>
                            <ShareCard
                                performance={ Results.Good }
                                matrix={ matrix }
                                text={ `My time ${time}` }
                            />
                        </div>
                    )
                }
            </div>
            <div className={ cn('play-area', {
                'play-area--centered': isPlaying,
                'row-5': !isShare,
                'row-2': isShare,
            }) }>
                <Switch>
                    <Route path={ AppRoutes.Play } exact>
                        {
                            shuffledMatrix && (
                                <div className="play-area__grid">
                                    <TilesGridInteractive
                                        matrix={ shuffledMatrix! }
                                        onMatrixChange={ onMatrixChange }
                                    />
                                </div>
                            )
                        }
                    </Route>
                    <Route path={ AppRoutes.PlayResult }>
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
                    </Route>
                    <Route path={ AppRoutes.PlayMenu }>
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
                    </Route>
                </Switch>
            </div>
        </Layout>
    );
}