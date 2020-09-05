import React, { useEffect, useCallback, useState } from 'react';
import {
    useLocation,
    useHistory,
    Route,
    Switch,
    useRouteMatch,
} from 'react-router-dom';
import cn from 'classnames';
import { cond, T, always, view } from 'ramda';
import { useSelector, useDispatch } from 'react-redux';

import './PuzzlePlay.scss';

import Layout from '../../components/Layout';
import Icon, { IconTypes } from '../../components/Icon';
import { PerformanceTypes, Results } from '../../constants/game';
import TilesGrid from '../../components/TilesGrid';
import TilesGridInteractive from '../../components/TilesGridInteractive';
import { AppRoutes } from '../../constants/urls';
import Menu from '../../components/Menu';
import ShareCard from '../../components/ShareCard';
import useShare from '../../lib/hooks/useShare';
import { setLevel, playLens } from '../../entities/play';
import { shuffleMtx } from '../../lib/shuffle';
import { TileInfo } from '../../lib/grid/types';
import { isMatricesEqual } from '../../lib/grid/calc-grid';

export default function PuzzlePlay() {
    const [isShare, setShare] = useState(false);
    const [timerValue, setTimerValue] = useState<number>(0);
    const [timer, setTimer] = useState<ReturnType<(typeof setInterval)> | null>(null);
    const [matrixForPlay, setMatrixForPlay] = useState<TileInfo[][] | null>(null);
    const { state } = useLocation<{ isNew?: boolean; isRetry?: boolean; }>();
    const history = useHistory();
    const [isNative, share] = useShare();
    const { level, matrix, performances } = useSelector(view(playLens));
    const dispatch = useDispatch();
    
    useEffect(() => {
        if (!matrixForPlay) {
            let shuffledMatrix = shuffleMtx<TileInfo>(matrix);
            while (isMatricesEqual(matrix, shuffledMatrix)) {
                shuffledMatrix = shuffleMtx<TileInfo>(matrix);
            }
            setMatrixForPlay(shuffledMatrix);
            startInterval();
        }
    }, [matrixForPlay]);

    const startInterval = useCallback(() => {
        let currentTimerValue = 1;

        setTimer(
            setInterval(() => {
                setTimerValue(currentTimerValue);
                currentTimerValue++;
            }, 1000)
        );
    }, []);
    const goPlayMenu = useCallback(() => {
        setShare(false);
        history.push(AppRoutes.PlayMenu);
    }, []);
    const goBack = useCallback(() => {
        history.goBack();
    }, []);
    const goRetry = useCallback(() => {
        clearInterval(timer!);
        setShare(false);
        setMatrixForPlay(null);
        setTimerValue(0);
        history.push(AppRoutes.Play, { isRefersh: true, });
    }, [timer]);
    const goHome = useCallback(() => {
        history.push(AppRoutes.Root);
    }, []);
    const goNext = useCallback(() => {
        setShare(false);
        setMatrixForPlay(null);
        setTimerValue(0);
        dispatch(setLevel({ level: level + 1 }));
        history.push(AppRoutes.Play);
    }, [level]);
    
    const isMenuOpened = Boolean(useRouteMatch(AppRoutes.PlayMenu));
    const isResultOpened = Boolean(useRouteMatch(AppRoutes.PlayResult));
    
    const handleShareIconClick = useCallback(() => {
        setShare(!isShare);
        if (isShare && isNative) {
            share({
                title: 'Look at my result!',
                text: `${Math.floor(timerValue / 60)}:${String(timerValue % 60).padStart(2, '0')}`,
            }).then(() => setShare(false));
        }
    }, [isShare, timerValue]);
    const handleMatrixChange = useCallback((changedMatrix: TileInfo[][]) => {
        if (isMatricesEqual(changedMatrix, matrix)) {
            history.push(AppRoutes.PlayResult);
            clearInterval(timer!);
        }
    }, [matrix, timer]);
    const getLeftIconType = useCallback(cond([
        [always(Boolean(isMenuOpened)), always(IconTypes.Back)],
        [T, always(IconTypes.Burger)],
    ]), [isMenuOpened]);
    const getRightIconType = useCallback(cond([
        [always(isResultOpened && !isNative), always(undefined)],
        [always(isResultOpened && !isShare), always(IconTypes.Share)],
        [always(isResultOpened && isShare), always(IconTypes.ShareActive)],
        [T, always(IconTypes.Refresh)],
    ]), [isResultOpened, isShare]);
    const getLeftIconHandler = useCallback(cond([
        [always(isMenuOpened), always(goBack)],
        [always(!isMenuOpened), always(goPlayMenu)],
    ]), [isMenuOpened]);
    const getRightIconHandler = useCallback(cond([
        [always(isResultOpened && !isNative), always(undefined)],
        [always(isResultOpened && !isMenuOpened), always(handleShareIconClick)],
        [T, always(goRetry)],
    ]), [isMenuOpened, isShare, isResultOpened, timer]);

    useEffect(() => {
        if (state && state.isNew) {

        }
    }, [state]);

    return (
        <Layout
            headerProps={{
                leftIconType: getLeftIconType(),
                rightIconType: getRightIconType(),
                onLeftIconClick: getLeftIconHandler(),
                onRightIconClick: getRightIconHandler(),
                performanceType: PerformanceTypes.Time,
                performanceValue: `${Math.floor(timerValue / 60)}:${String(timerValue % 60).padStart(2, '0')}`,
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
                                text={ `My time ${Math.floor(timerValue / 60)}:${String(timerValue % 60).padStart(2, '0')}` }
                            />
                        </div>
                    )
                }
            </div>
            <div className={ cn('play-area', {
                'play-area--centered': !isMenuOpened && !isResultOpened,
                'row-5': !isShare,
                'row-2': isShare,
            }) }>
                <Switch>
                    <Route path={ AppRoutes.Play } exact>
                        {
                            matrixForPlay && (
                                <div className="play-area__grid">
                                    <TilesGridInteractive
                                        matrix={ matrixForPlay! }
                                        onMatrixChange={ handleMatrixChange }
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
                                Ideal { `${`${Math.floor(performances[0] / 60)}:${String(performances[0] % 60).padStart(2, '0')}`}` }
                            </div>
                        </div>
                        {
                            timerValue < performances[2]
                                ? (
                                    <Menu
                                        list={[
                                            { text: 'Retry', onClick: goRetry },
                                            { text: 'Next', onClick: goNext },
                                        ]}
                                    />
                                )
                                : (
                                    <Menu
                                        list={[
                                            { text: 'Retry', onClick: goRetry },
                                        ]}
                                    />
                                )
                        }
                    </Route>
                    <Route path={ AppRoutes.PlayMenu }>
                        <Menu
                            list={[
                                { text: 'Home', onClick: goHome },
                                { text: 'Retry', onClick: goRetry },
                                { text: 'Resume', onClick: goBack },
                            ]}
                        />
                    </Route>
                </Switch>
            </div>
        </Layout>
    );
}
