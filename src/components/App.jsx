import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MenuScreen from './screens/MenuScreen/MenuScreen';
import ScenariosList from './screens/ScenariosList/ScenariosList';
import ScenarioDetails from './screens/ScenarioDetails/ScenarioDetails';
import ScenarioMap from './screens/ScenarioMap/ScenarioMap';
import ScenarioPlay from './screens/ScenarioPlay/ScenarioPlay';
import ChoosePuzzleTypeScreen from './screens/ChoosePuzzleTypeScreen/ChoosePuzzleTypeScreen';
import PlayScreen from './screens/PlayScreen/PlayScreen';

import {
    HOME, PLAY, PLAY_PUZZLE_ROUTE, SCENARIO, SCENARIO_DETAILS, SCENARIO_MAP, SCENARIO_PLAY
} from '_constants/routes';

export default function App() {
    return (
        <Router>
            <Switch>
                <Route path={ HOME } exact component={ MenuScreen } />
                <Route path={ SCENARIO } exact component={ ScenariosList } />
                <Route path={ SCENARIO_DETAILS } component={ ScenarioDetails } />
                <Route path={ SCENARIO_MAP } component={ ScenarioMap } />
                <Route path={ SCENARIO_PLAY } component={ ScenarioPlay } />
                <Route path={ PLAY } exact component={ ChoosePuzzleTypeScreen } />
                <Route path={ PLAY_PUZZLE_ROUTE } component={ PlayScreen } />
            </Switch>
        </Router>
    );
}