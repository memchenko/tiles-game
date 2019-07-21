import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MenuScreen from './screens/MenuScreen/MenuScreen';
import ChoosePuzzleTypeScreen from './screens/ChoosePuzzleTypeScreen/ChoosePuzzleTypeScreen';
import PlayScreen from './screens/PlayScreen/PlayScreen';

import { HOME, PLAY, PLAY_PUZZLE_ROUTE } from '_constants/routes';

export default function App() {
    return (
        <Router>
            <Switch>
                <Route path={ HOME } exact component={ MenuScreen } />
                <Route path={ PLAY } exact component={ ChoosePuzzleTypeScreen } />
                <Route path={ PLAY_PUZZLE_ROUTE } component={ PlayScreen } />
            </Switch>
        </Router>
    );
}