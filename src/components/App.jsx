import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MenuScreen from './screens/MenuScreen/MenuScreen';
import CampaignMap from './screens/CampaignMap/CampaignMap';
import ChoosePuzzleTypeScreen from './screens/ChoosePuzzleTypeScreen/ChoosePuzzleTypeScreen';
import PlayScreen from './screens/PlayScreen/PlayScreen';

import { HOME, PLAY, PLAY_PUZZLE_ROUTE, CAMPAIGN, CAMPAIGN_GAME } from '_constants/routes';

export default function App() {
    return (
        <Router>
            <Switch>
                <Route path={ HOME } exact component={ MenuScreen } />
                <Route path={ CAMPAIGN } component={ CampaignMap } />
                <Route path={ CAMPAIGN_GAME } component={ CampaignMap } />
                <Route path={ PLAY } component={ ChoosePuzzleTypeScreen } />
                <Route path={ PLAY_PUZZLE_ROUTE } component={ PlayScreen } />
            </Switch>
        </Router>
    );
}