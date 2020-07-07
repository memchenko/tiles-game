import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { view } from 'ramda';

import { IScenarioItemProps } from './types';

import { AppRoutes } from '../../constants/urls';
import { scenarioLens, IStateWithScenario, IScenarioState } from '../../entities/scenario';

export default function ScenariosMenu() {
    const scenarios = useSelector<IStateWithScenario, IScenarioState>(view(scenarioLens));
    
    return (
        <ul>
            {
                scenarios.list.map(
                    ({ id, ...scenario }) => <ScenarioItem key={ id } id={ id } { ...scenario } />
                )
            }
        </ul>
    );
}
function ScenarioItem({ id, icon, title, difficulty }: IScenarioItemProps) {
    return (
        <li>
            <Link to={{
                pathname: AppRoutes.ScenarioDetails.replace(':scenarioId', String(id))
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
