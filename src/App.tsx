import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { AppRoutes } from './constants/urls';
import MainMenu from './screens/MainMenu';
import ScenariosMenu from './screens/ScenariosMenu';
import ScenarioDetails from './screens/ScenarioDetails';
import ScenarioMap from './screens/ScenarioMap';
import ScenarioPlay from './screens/ScenarioPlay';
import PuzzlesMenu from './screens/PuzzlesMenu';
import PuzzlePlay from './screens/PuzzlePlay';

function App() {
  return (
    <Router>
      <Switch>
        <Route path={ AppRoutes.Root } component={ MainMenu } exact />
        <Route path={ AppRoutes.Scenario } component={ ScenariosMenu } exact />
        <Route path={ AppRoutes.ScenarioDetails } component={ ScenarioDetails } />
        <Route path={ AppRoutes.ScenarioMap } component={ ScenarioMap } />
        <Route path={ AppRoutes.ScenarioPlay } component={ ScenarioPlay } />
        <Route path={ AppRoutes.Play } component={ PuzzlesMenu } exact />
        <Route path={ AppRoutes.PlayPuzzle } component={ PuzzlePlay } />
      </Switch>
    </Router>
  );
}

export default App;
