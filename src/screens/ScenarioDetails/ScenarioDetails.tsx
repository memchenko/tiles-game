import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { view } from 'ramda';

import { AppRoutes } from '../../constants/urls';
import { scenarioLens, IScenarioState, IStateWithScenario } from '../../entities/scenario';

export default function ScenarioDetails() {
    const { scenarioId } = useParams();
    const scenarios = useSelector<IStateWithScenario, IScenarioState>(view(scenarioLens));
    const scenario = scenarios.list.find(({ id }) => id === Number(scenarioId));

    if (!scenario) {
        throw new Error(`No scenario with id: ${scenarioId}`);
    }

    const { title, icon, poster, description, progress, difficulty } = scenario;

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
                pathname: AppRoutes.ScenarioMap.replace(':scenarioId', scenarioId)
            }}>Play</Link>
        </div>
    );
}
