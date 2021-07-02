import React, { useEffect, useCallback, useState, useRef } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { cond, T, always, view } from 'ramda';
import { useSelector, useDispatch } from 'react-redux';

import { IconTypes } from '../../components/Icon';
import { AppRoutes } from '../../constants/urls';
import { useShare } from '../../lib/hooks/useShare';
import { setLevel, playLens, setSolved, setUnsolved } from '../../entities/play';
import { shuffleMtx } from '../../lib/shuffle';
import { PuzzlePlayScreen } from '../../components/PuzzlePlayScreen';
import { formatSeconds } from '../../utils/time';
import { sound, SoundTypes } from '../../lib/sound';
import { analytics } from '../../lib/analytics';
import { Results } from '../../constants/game';
import { isMatricesEqual } from '../../lib/grid/matrix-calculator';

export function PuzzlePlay() {
    const [isShare, setShare] = useState(false);
    const [matrixForPlay, setMatrixForPlay] = useState<string[][] | null>(null);
    const history = useHistory();
    const [isNative, share] = useShare();
    const { level, matrix, performances, isSolved } = useSelector(view(playLens));
    const dispatch = useDispatch();
    const seconds = useRef(0);

    useEffect(() => {
        if (!matrixForPlay) {
            let shuffledMatrix = shuffleMtx<string>(matrix);
            while (isMatricesEqual(matrix, shuffledMatrix)) {
                shuffledMatrix = shuffleMtx<string>(matrix);
            }
            setMatrixForPlay(shuffledMatrix);
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
        setShare(false);
        setMatrixForPlay(null);
        seconds.current = 0;
        dispatch(setLevel({ level }));
        history.replace(AppRoutes.Play);
        analytics.set('retriedTimes');
    }, [level, seconds]);
    const goHome = useCallback(() => {
        history.replace(AppRoutes.Root);
    }, [history]);
    const goNext = useCallback(() => {
        setShare(false);
        setMatrixForPlay(null);
        seconds.current = 0;
        dispatch(setLevel({ level: level + 1 }));
        history.replace(AppRoutes.Play);
        analytics.set('maxLevels', level + 1);
        analytics.set('gamesPlayed');
    }, [level, seconds]);

    const isMenuOpened = Boolean(useRouteMatch(AppRoutes.PlayMenu));
    const isResultOpened = Boolean(useRouteMatch(AppRoutes.PlayResult));
    
    const handleShareIconClick = useCallback(() => {
            setShare(!isShare);
    }, [isShare]);
    const playOnSolvedSound = useCallback(() => {
        if (seconds.current <= performances[2]) {
            sound.start(SoundTypes.ResultSuccess);
        }
    }, [seconds, performances]);
    const handleMatrixChange = useCallback((changedMatrix: string[][]) => {
        if (isMatricesEqual(changedMatrix, matrix)) {
            dispatch(setSolved());
            history.replace(AppRoutes.PlayResult);
            playOnSolvedSound();
        }
    }, [matrix, history]);
    const handleShareCardDraw = useCallback((blob: Blob | null) => {
        if (isShare && isNative) {
            let file;

            if (blob) {
                file = new File([blob], 'file.jpeg', { type: 'image/jpeg' });
            }

            const shareData: any = {
                text: `Hey! I solved ${level} level for only ${formatSeconds(seconds.current)}. Try to beat my record in TILO game!`,
                url: window.location.origin,
            };

            if (file) {
                shareData.files = [file];
            }
            
            share(shareData)
                .catch(console.log)
                .finally(() => setShare(false));
        }
    }, [isShare, seconds, level]);
    const retry = useCallback(() => {
        setShare(false);
        setMatrixForPlay(null);
        seconds.current = 0;
        dispatch(setUnsolved());
        history.replace(AppRoutes.Play);
        analytics.set('retriedTimes');
    }, [seconds]);
    const handleTimerUpdate = useCallback((value: number) => {
        seconds.current = value;
    }, [seconds]);

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
    ]), [isMenuOpened, isShare, isResultOpened]);
    const isSuccessfullySolved = seconds.current < performances[2];
    const shareCardText = `MY TIME ${formatSeconds(seconds.current)}`;
    const starsNumber = performances.filter(
        (performance: number) => seconds.current <= performance
    ).length;
    let result = Results.Bad;

    if (seconds.current <= performances[0]) {
        result = Results.Best;
    } else if (seconds.current <= performances[1]) {
        result = Results.Good;
    } else if (seconds.current <= performances[2]) {
        result = Results.Normal;
    }

    return (
        matrixForPlay && <PuzzlePlayScreen
            isNative={ isNative }
            isSolved={ isSolved }
            isSuccessfullySolved={ isSuccessfullySolved }
            isShare={ isShare }
            isPlaying={ !isMenuOpened && !isResultOpened }
            performances={ performances }
            level={ level }
            result={ result }
            matrix={ matrix }
            shuffledMatrix={ matrixForPlay }
            leftIcon={ getLeftIconType() }
            rightIcon={ getRightIconType() }
            shareCardText={ shareCardText }
            starsNumber={ starsNumber }
            onLeftIconClick={ getLeftIconHandler() }
            onRightIconClick={ getRightIconHandler() }
            onHomeClick={ goHome }
            onRetryClick={ goRetry }
            onBackClick={ goBack }
            onNextClick={ goNext }
            onMatrixChange={ handleMatrixChange }
            onShareCardDraw={ handleShareCardDraw }
            onTimerUpdate={ handleTimerUpdate }
        />
    );
}
