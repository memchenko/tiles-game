import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

import { SCENARIO_DETAILS } from '_constants/routes';

// list: { id: number | string, pic: string, title: string, difficulty: string }

export default function ScenariosList({ scenarios }) {
    return (
        <ul>
            {
                scenarios.map(scenario => <ScenarioItem key={ scenario.id } {...scenario} />)
            }
        </ul>
    );
}

const scenarioItemPropsShape = {
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    pic: PropTypes.string,
    title: PropTypes.string,
    difficulty: PropTypes.oneOf(['easy', 'medium', 'hard', 'expert', 'god'])
};

ScenariosList.propTypes = {
    scenarios: PropTypes.arrayOf(PropTypes.shape(scenarioItemPropsShape))
};

function ScenarioItem({ id, pic, title, difficulty }) {
    return (
        <li>
            <Link to={{
                pathname: SCENARIO_DETAILS,
                state: { id }
            }}>
                <span>
                    <img src={ pic } alt="Scenario picture" />
                </span>
                <span>
                    <h3>{ title }</h3>
                    <span>{ difficulty }</span>
                </span>
            </Link>
        </li>
    );
}

ScenarioItem.propTypes = scenarioItemPropsShape;
