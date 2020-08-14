import React, { useEffect, useCallback, useState } from 'react';
import {
    useLocation,
    useHistory,
    Route,
    Switch,
    useRouteMatch,
} from 'react-router-dom';
import cn from 'classnames';
import { cond, T, always } from 'ramda';

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

const mtx = [
    ['#F7567C', '#5D576B', '#EDB88B'].map(color => ({ color })),
    ['#F7567C', '#5D576B', '#EDB88B'].reverse().map(color => ({ color })),
    ['#F7567C', '#5D576B', '#EDB88B'].map(color => ({ color })),
];

export default function PuzzlePlay() {
    const [isShare, setShare] = useState(false);
    const { state } = useLocation<{ isNew?: boolean; isRetry?: boolean; }>();
    const history = useHistory();
    const [isNative, share] = useShare();
    
    const goPlayMenu = useCallback(() => {
        setShare(false);
        history.push(AppRoutes.PlayMenu);
    }, []);
    const goBack = useCallback(() => {
        history.goBack();
    }, []);
    const goRetry = useCallback(() => {
        setShare(false);
        history.push(AppRoutes.Play, { isRefersh: true, });
    }, []);
    const goHome = useCallback(() => {
        history.push(AppRoutes.Root);
    }, []);
    const goNext = () => {
        setShare(false);
    };
    
    const isMenuOpened = Boolean(useRouteMatch(AppRoutes.PlayMenu));
    const isResultOpened = Boolean(useRouteMatch(AppRoutes.PlayResult));
    
    const handleShareIconClick = useCallback(() => {
        setShare(!isShare);
        if (isShare && share) {
            share({
                title: 'Look at my result!',
                text: '01:24',
            }).then(() => setShare(false));
        }
    }, [isShare]);
    const getLeftIconType = useCallback(cond([
        [always(Boolean(isMenuOpened)), always(IconTypes.Back)],
        [T, always(IconTypes.Burger)],
    ]), [isMenuOpened]);
    const getRightIconType = useCallback(cond([
        [always(isResultOpened && !isShare), always(IconTypes.Share)],
        [always(isResultOpened && isShare), always(IconTypes.ShareActive)],
        [T, always(IconTypes.Refresh)],
    ]), [isResultOpened, isShare]);
    const getLeftIconHandler = useCallback(cond([
        [always(isMenuOpened), always(goBack)],
        [always(!isMenuOpened), always(goPlayMenu)],
    ]), [isMenuOpened]);
    const getRightIconHandler = useCallback(cond([
        [always(isResultOpened && !isMenuOpened), always(handleShareIconClick)],
        [T, always(goRetry)],
    ]), [isMenuOpened, isShare, isResultOpened]);

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
                performanceValue: '1:34',
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
                    <TilesGrid matrix={ mtx } />
                </div>
                {
                    isShare && (
                        <div className={ cn('play-share') }>
                            <ShareCard
                                performance={ Results.Good }
                                matrix={ mtx }
                                text="Time 01:34"
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
                        <div className="play-area__grid">
                            <TilesGridInteractive
                                matrix={ mtx }
                                onMatrixChange={ () => {} }
                            />
                        </div>
                    </Route>
                    <Route path={ AppRoutes.PlayResult }>
                        <div className={ cn('play-area__result', {
                            undisplay: isShare,
                        }) }>
                            <div className="play-area__stars">
                                <Icon type={ IconTypes.Star } />
                                <Icon type={ IconTypes.Star } />
                                <Icon type={ IconTypes.StarEmpty } />
                            </div>
                            <div className="play-area__ideal">
                                Ideal 01:10
                            </div>
                        </div>
                        <Menu
                            list={[
                                { text: 'Retry', onClick: goRetry },
                                { text: 'Next', onClick: goNext },
                            ]}
                        />
                    </Route>
                    <Route path={ AppRoutes.PlayMenu }>
                        <Menu
                            list={[
                                { text: 'Home', onClick: goHome },
                                { text: 'Retry', onClick: goRetry },
                                { text: 'Continue', onClick: goBack },
                            ]}
                        />
                    </Route>
                </Switch>
            </div>
        </Layout>
    );
}
