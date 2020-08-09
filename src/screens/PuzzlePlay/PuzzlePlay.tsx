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
import { IconTypes } from '../../components/Icon';
import { PerformanceTypes } from '../../constants/game';
import TilesGrid from '../../components/TilesGrid';
import TilesGridInteractive from '../../components/TilesGridInteractive';
import { AppRoutes } from '../../constants/urls';
import Menu from '../../components/Menu';

const mtx = [
    ['#F7567C', '#5D576B', '#EDB88B'].map(color => ({ color })),
    ['#F7567C', '#5D576B', '#EDB88B'].reverse().map(color => ({ color })),
    ['#F7567C', '#5D576B', '#EDB88B'].map(color => ({ color })),
];

export default function PuzzlePlay() {
    const [isShare, setShare] = useState(false);
    const { state } = useLocation<{ isNew?: boolean; isRetry?: boolean; }>();
    const history = useHistory();
    
    const goPlayMenu = useCallback(() => {
        history.push(AppRoutes.PlayMenu);
    }, []);
    const goBack = useCallback(() => {
        history.push(AppRoutes.Play)
    }, []);
    const goRetry = useCallback(() => {
        history.push(AppRoutes.Play, { isRefersh: true, });
    }, []);
    const goHome = useCallback(() => {
        history.push(AppRoutes.Root);
    }, []);
    const goNext = () => {};
    
    const isMenuOpened = Boolean(useRouteMatch(AppRoutes.PlayMenu));
    const isResultOpened = Boolean(useRouteMatch(AppRoutes.PlayResult));
    
    const handleShareIconClick = useCallback(() => {
        setShare(!isShare);
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
            <div className={ cn('row-2', 'grid-row') }>
                <div className={ cn('col-center-2', 'puzzle-play-example', {
                    undisplay: isShare,
                }) }>
                    <TilesGrid matrix={ mtx } />
                </div>
                <div className={ cn({
                    undisplay: !isShare,
                }) }>Share</div>
            </div>
            <div className={ cn('row-5', 'puzzle-play-area') }>
                <Switch>
                    <Route path={ AppRoutes.Play } exact>
                        <div className="puzzle-play-area__grid">
                            <TilesGridInteractive
                                matrix={ mtx }
                                onMatrixChange={ () => {} }
                            />
                        </div>
                    </Route>
                    <Route path={ AppRoutes.PlayResult }>
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
