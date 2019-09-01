import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import useGlobalState from '_hooks/useGlobalState';

function ScenarioMap({ location }) {
    const [] = useGlobalState();

    return (
        <div></div>
    );
}

ScenarioMap.propTypes = {
    location: PropTypes.shape({
        state: PropTypes.shape({
            scenarioId: PropTypes.number.isRequired
        }).isRequired
    }).isRequired
};

export default withRouter(ScenarioMap);