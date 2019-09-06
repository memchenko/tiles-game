import React, { useEffect, createRef } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import useRequest from '_hooks/useRequest';
import useGlobalState from '_hooks/useGlobalState';
import { SCENARIOS_RESULTS, SCENARIOS_MAPS } from '_src/store/selectors';
import { SCENARIO_MAP_CSS_CLASSES, SCENARIO_MAP_DATA_ATTRS, RESULTS } from '_constants/game';
import { SCENARIO_PLAY } from '_constants/routes';

const { DISABLED, NORMAL_PERFORMANCE, GOOD_PERFORMANCE, BEST_PERFORMANCE } = SCENARIO_MAP_CSS_CLASSES;
const { NORMAL, GOOD, BEST } = RESULTS;
const mapContainer = createRef();

const PERFORMANCE_TO_CSS_CLASS = {
    [NORMAL]: NORMAL_PERFORMANCE,
    [GOOD]: GOOD_PERFORMANCE,
    [BEST]: BEST_PERFORMANCE
};

const capitalize = word => word.split('').map((el, i) => i === 0 ? el.toUpperCase() : el).join('');
const snakeToCamel = str => str
    .split('-')
    .map((el, i) => i > 0 ? capitalize(el) : el)
    .join('');

function getUrlWithPathParams(url, pathParams) {
    return Object.entries(pathParams).reduce((url, [param, value]) => {
        return url.replace(`:${param}`, value);
    }, url);
}

function setLevelsResults(scenarioId, results, maps, history) {
    return () => {
        if (!mapContainer.current) return;
        
        const levelsNodes = document.querySelectorAll(`[data-${SCENARIO_MAP_DATA_ATTRS.LEVEL}]`);
        Array.prototype.forEach.call(levelsNodes, (node) => {
            const stepNumberFromHTML = +node.dataset[snakeToCamel(SCENARIO_MAP_DATA_ATTRS.LEVEL)];
            const css = node.classList;
            const { openOnStepSolved } = maps.get(stepNumberFromHTML) || {};
            const isAddDisabled = stepNumberFromHTML > 0 && !results.has(openOnStepSolved);

            if (isAddDisabled) {
                css.add(DISABLED);
            } else if (results.has(stepNumberFromHTML)) {
                const { type } = results.get(stepNumberFromHTML);

                css.add(PERFORMANCE_TO_CSS_CLASS[type]);
            }

            if (!isAddDisabled) {
                node.addEventListener('click', () => {
                    const urlScenarioId = getUrlWithPathParams(SCENARIO_PLAY, {
                        scenarioId, stepNumber: stepNumberFromHTML
                    });
                
                    history.push(urlScenarioId);
                });
            }
        });
    };
}

function ScenarioMap({ match, history }) {
    const { scenarioId } = match.params;
    
    const [{ isPending, data, error }, request] = useRequest();
    const [results, maps] = useGlobalState(SCENARIOS_RESULTS, SCENARIOS_MAPS);

    useEffect(() => {
        request({ method: 'get', url: `/assets/maps/${scenarioId}.html`, responseType: 'text' });
    }, []);

    useEffect(setLevelsResults(
        scenarioId,
        results.get(+scenarioId),
        maps.get(+scenarioId),
        history
    ));

    return (
        error
            ? <div>Error</div>
            : !data || isPending
            ? <div>Suspense...</div>
            : <div ref={ mapContainer } dangerouslySetInnerHTML={{ __html: data }}></div>
    );
}

ScenarioMap.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            scenarioId: PropTypes.string.isRequired
        }).isRequired
    }).isRequired,
    history: PropTypes.shape({
        push: PropTypes.func.isRequired
    }).isRequired
};

export default withRouter(ScenarioMap);