import React, { useEffect, useCallback } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { view } from 'ramda';

import { AppRoutes } from './constants/urls';
import MainMenu from './screens/MainMenu';
import PuzzlePlay from './screens/PuzzlePlay';
import OpenIfInited from './components/OpenIfInited';
import { appLens } from './entities/app';
import LoadingPage from './components/LoadingPage';
import Credits from './screens/Credits';

function App() {
  const inited = useSelector(view(appLens));
  const history = useHistory();
  const backHandler = useCallback((event) => {
    history.push('/');
  }, [history]);

  useEffect(() => {
    window.addEventListener('popstate', backHandler);

    return () => {
      window.removeEventListener('popstate', backHandler);
    };
  }, [backHandler]);

  return (<>
    {!inited
      ? (
        <LoadingPage />
      )
      : (
        <Switch>
          <Route path={ AppRoutes.Root } exact>
            <MainMenu />
          </Route>
          <OpenIfInited
            path={ AppRoutes.Play }
            render={() => <PuzzlePlay />}
          />
          <OpenIfInited
            path={ AppRoutes.Credits }
            render={() => <Credits />}
          />
          <Route path="*" exact>
            <MainMenu />
          </Route>
        </Switch>
      )}
  </>);
}

export default App;
