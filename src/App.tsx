import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { AppRoutes } from './constants/urls';
import MainMenu from './screens/MainMenu';
import PuzzlePlay from './screens/PuzzlePlay';

function App() {
  return (
    <Router>
      <Switch>
        <Route path={ AppRoutes.Root } exact>
          <MainMenu />
        </Route>
        <Route path={ AppRoutes.Play }>
          <PuzzlePlay />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
