import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import useGlobalState from '_hooks/useGlobalState';
import { SCENARIO_DETAILS } from '_constants/routes';
import { SCENARIOS_LENS } from '_src/store/selectors';
import { DIFFICULTIES } from '_constants/game';

// list: { id: number | string, icon: string, title: string, difficulty: string }

export default function ScenariosList() {
    const [scenarios] = useGlobalState(SCENARIOS_LENS);
    
    return (
        <ul>
            {
                [...scenarios].map(([id, scenario]) => <ScenarioItem key={ id } id={ id } {...scenario} />)
            }
        </ul>
    );
}

function ScenarioItem({ id, icon, title, difficulty }) {
    return (
        <li>
            <Link to={{
                pathname: SCENARIO_DETAILS.replace(':scenarioId', id)
            }}>
                <span>
                    <img src={ icon } alt={ `Picture for ${title} scenario` } style={{ width: 60, height: 60 }} />
                </span>
                <span>
                    <h3>{ title }</h3>
                    <span>{ difficulty }</span>
                </span>
            </Link>
        </li>
    );
}

ScenarioItem.propTypes = {
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    icon: PropTypes.string,
    title: PropTypes.string,
    difficulty: PropTypes.oneOf(DIFFICULTIES)
};
