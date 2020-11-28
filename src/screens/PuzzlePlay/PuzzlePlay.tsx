import React, { useEffect, useCallback, useState, useRef } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { cond, T, always, view } from 'ramda';
import { useSelector, useDispatch } from 'react-redux';

import { IconTypes } from '../../components/Icon';
import { AppRoutes } from '../../constants/urls';
import useShare from '../../lib/hooks/useShare';
import { setLevel, playLens, setSolved, setUnsolved } from '../../entities/play';
import { shuffleMtx } from '../../lib/shuffle';
import { TileInfo, isMatricesEqual } from '../../lib/grid';
import PuzzlePlayScreen from '../../components/PuzzlePlayScreen';
import { formatSeconds } from '../../utils/time';
import sounds, { SoundTypes } from '../../lib/sound';
import analytics from '../../lib/analytics';

export default function PuzzlePlay() {
    const [isShare, setShare] = useState(false);
    const [timerValue, setTimerValue] = useState(0);
    const [timer, setTimer] = useState<ReturnType<(typeof setInterval)> | null>(null);
    const [matrixForPlay, setMatrixForPlay] = useState<TileInfo[][] | null>(null);
    const history = useHistory();
    const [isNative, share] = useShare();
    const { level, matrix, performances, isSolved } = useSelector(view(playLens));
    const dispatch = useDispatch();
    const staticTimerValue = useRef(0);

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
        history.replace(AppRoutes.PlayMenu);
    }, []);
    const goBack = useCallback(() => {
        if (isSolved) {
            history.replace(AppRoutes.PlayResult);
        } else {
            history.replace(AppRoutes.Play);
        }
    }, [isSolved]);
    const goRetry = useCallback(() => {
        clearInterval(timer!);
        setShare(false);
        setMatrixForPlay(null);
        setTimerValue(0);
        staticTimerValue.current = 0;
        dispatch(setLevel({ level }));
        history.replace(AppRoutes.Play);
        analytics.set('retriedTimes');
    }, [timer, level, staticTimerValue]);
    const goHome = useCallback(() => {
        clearInterval(timer!);
        history.replace(AppRoutes.Root);
    }, [timer]);
    const goNext = useCallback(() => {
        setShare(false);
        setMatrixForPlay(null);
        setTimerValue(0);
        staticTimerValue.current = 0;
        dispatch(setLevel({ level: level + 1 }));
        history.replace(AppRoutes.Play);
        analytics.set('maxLevels', level + 1);
        analytics.set('gamesPlayed');
    }, [level, staticTimerValue]);

    const isMenuOpened = Boolean(useRouteMatch(AppRoutes.PlayMenu));
    const isResultOpened = Boolean(useRouteMatch(AppRoutes.PlayResult));
    
    const handleShareIconClick = useCallback(() => {
            setShare(!isShare);
    }, [isShare]);
    const playOnSolvedSound = useCallback(() => {
        if (staticTimerValue.current <= performances[2]) {
            sounds.start(SoundTypes.ResultSuccess);
        }
    }, [staticTimerValue, performances]);
    const handleMatrixChange = useCallback((changedMatrix: TileInfo[][]) => {
        if (isMatricesEqual(changedMatrix, matrix)) {
            dispatch(setSolved());
            history.replace(AppRoutes.PlayResult);
            clearInterval(timer!);
            playOnSolvedSound();
        }
    }, [matrix, timer]);
    const handleShareCardDraw = useCallback((blob: Blob | null) => {
        if (isShare && isNative) {
            let file;

            if (blob) {
                file = new File([blob], 'file.jpeg', { type: 'image/jpeg' });
            }

            const shareData: any = {
                text: `Hey! I solved ${level} level for only ${formatSeconds(timerValue)}. Try to beat my record in TILO game!`,
                url: window.location.origin,
            };

            if (file) {
                shareData.files = [file];
            }
            
            share(shareData)
                .catch(console.log)
                .finally(() => setShare(false));
        }
    }, [isShare, timerValue, level]);
    const retry = useCallback(() => {
        clearInterval(timer!);
        setShare(false);
        setMatrixForPlay(null);
        setTimerValue(0);
        staticTimerValue.current = 0;
        dispatch(setUnsolved());
        history.replace(AppRoutes.Play);
        analytics.set('retriedTimes');
    }, [timer, staticTimerValue]);
    const startInterval = useCallback(() => {
        let currentTimerValue = 1;

        setTimer(
            setInterval(() => {
                setTimerValue(currentTimerValue);
                staticTimerValue.current = currentTimerValue;
                currentTimerValue++;
            }, 1000)
        );
    }, [staticTimerValue]);

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
            isNative={ isNative }
            isSolved={ isSolved }
            isShare={ isShare }
            isPlaying={ !isMenuOpened && !isResultOpened }
            performances={ performances }
            timerValue={ timerValue }
            level={ level }
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
            onShareCardDraw={ handleShareCardDraw }
        />
    );
}
