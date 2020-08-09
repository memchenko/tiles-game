import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { AppRoutes } from './constants/urls';
import MainMenu from './screens/MainMenu';
import ScenariosMenu from './screens/ScenariosMenu';
import ScenarioDetails from './screens/ScenarioDetails';
import ScenarioPlay from './screens/ScenarioPlay';
import PuzzlePlay from './screens/PuzzlePlay';

function App() {
  return (
    <Router>
      <Switch>
        <Route path={ AppRoutes.Root } exact>
          <MainMenu />
        </Route>
        <Route path={ AppRoutes.Scenario } component={ ScenariosMenu } exact />
        <Route path={ AppRoutes.ScenarioDetails } component={ ScenarioDetails } />
        <Route path={ AppRoutes.ScenarioPlay } component={ ScenarioPlay } />
        <Route path={ AppRoutes.Play }>
          <PuzzlePlay />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
