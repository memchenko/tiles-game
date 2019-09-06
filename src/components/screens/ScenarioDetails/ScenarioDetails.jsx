import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import useGlobalState from '_hooks/useGlobalState';
import { SCENARIOS_LENS } from '_src/store/selectors';
import { SCENARIO_MAP } from '_constants/routes';

function ScenarioDetails({ match }) {
    const { scenarioId } = match.params;
    const [scenarios] = useGlobalState(SCENARIOS_LENS);
    const {
        title, icon, poster, description, progress, difficulty
    } = scenarios.get(+scenarioId);

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
                pathname: SCENARIO_MAP.replace(':scenarioId', scenarioId)
            }}>Play</Link>
        </div>
    );
}

ScenarioDetails.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            scenarioId: PropTypes.string.isRequired
        }).isRequired
    }).isRequired
};

export default withRouter(ScenarioDetails);