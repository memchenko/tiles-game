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