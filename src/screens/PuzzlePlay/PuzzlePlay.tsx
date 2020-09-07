import React, { useEffect, useCallback, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { cond, T, always, view } from 'ramda';
import { useSelector, useDispatch } from 'react-redux';

import { IconTypes } from '../../components/Icon';
import { AppRoutes } from '../../constants/urls';
import useShare from '../../lib/hooks/useShare';
import { setLevel, playLens, setSolved, setUnsolved } from '../../entities/play';
import { shuffleMtx } from '../../lib/shuffle';
import { TileInfo } from '../../lib/grid/types';
import { isMatricesEqual } from '../../lib/grid/calc-grid';
import PuzzlePlayScreen from '../../components/PuzzlePlayScreen';
import { formatSeconds } from '../../utils/time';

export default function PuzzlePlay() {
    const [isShare, setShare] = useState(false);
    const [timerValue, setTimerValue] = useState<number>(0);
    const [timer, setTimer] = useState<ReturnType<(typeof setInterval)> | null>(null);
    const [matrixForPlay, setMatrixForPlay] = useState<TileInfo[][] | null>(null);
    const history = useHistory();
    const [isNative, share] = useShare();
    const { level, matrix, performances, isSolved } = useSelector(view(playLens));
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
        dispatch(setLevel({ level }));
        history.push(AppRoutes.Play);
    }, [timer, level]);
    const goHome = useCallback(() => {
        clearInterval(timer!);
        history.push(AppRoutes.Root);
    }, [timer]);
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
                text: formatSeconds(timerValue),
            }).then(() => setShare(false));
        }
    }, [isShare, timerValue]);
    const handleMatrixChange = useCallback((changedMatrix: TileInfo[][]) => {
        if (isMatricesEqual(changedMatrix, matrix)) {
            dispatch(setSolved());
            history.push(AppRoutes.PlayResult);
            clearInterval(timer!);
        }
    }, [matrix, timer]);
    const retry = useCallback(() => {
        clearInterval(timer!);
        setShare(false);
        setMatrixForPlay(null);
        setTimerValue(0);
        dispatch(setUnsolved());
        console.log('whtever');
        history.push(AppRoutes.Play);
    }, [timer]);
    const startInterval = useCallback(() => {
        let currentTimerValue = 1;

        setTimer(
            setInterval(() => {
                setTimerValue(currentTimerValue);
                currentTimerValue++;
            }, 1000)
        );
    }, []);

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
        [T, always(retry)],
    ]), [isMenuOpened, isShare, isResultOpened, timer]);

    return (
        matrixForPlay && <PuzzlePlayScreen
            isSolved={isSolved}
            isShare={ isShare }
            isPlaying={ !isMenuOpened && !isResultOpened }
            performances={ performances }
            timerValue={ timerValue }
            matrix={ matrix }
            shuffledMatrix={ matrixForPlay }
            leftIcon={ getLeftIconType() }
            rightIcon={ getRightIconType() }
            onLeftIconClick={ getLeftIconHandler() }
            onRightIconClick={ getRightIconHandler() }
            onHomeClick={ goHome }
            onRetryClick={ goRetry }
            onBackClick={ goBack }
            onNextClick={ goNext }
            onMatrixChange={ handleMatrixChange }
        />
    );
}
