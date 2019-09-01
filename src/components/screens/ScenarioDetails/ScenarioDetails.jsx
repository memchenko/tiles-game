import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import useGlobalState from '_hooks/useGlobalState';
import { SCENARIOS_LENS } from '_root/store/selectors';

function ScenarioDetails({ location }) {
    const [scenarios] = useGlobalState(SCENARIOS_LENS);
    const {
        title, icon, poster, description, progress, difficulty
    } = scenarios.get(location.state.scenarioId);

    return (
        <div>
            <header>
                <img src={ icon } alt="Puzzle icon" style={{ height: 50, width: 50 }} />
                <h1>{ title }</h1>
                <img src={ poster } alt="Poster image of puzzle" />
            </header>
            <div>
                <span>{ progress }</span>
                <span>{ difficulty }</span>
            </div>
            <p>{ description }</p>
            <Link to={{
                pathname: '/',
                state: location.state.scenarioId
            }}>Play</Link>
        </div>
    );
}

ScenarioDetails.propTypes = {
    location: PropTypes.shape({
        state: PropTypes.shape({
            scenarioId: PropTypes.number.isRequired
        }).isRequired
    }).isRequired
};

export default withRouter(ScenarioDetails);