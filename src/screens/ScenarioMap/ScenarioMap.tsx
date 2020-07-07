import React, { useEffect, useRef, useState, RefObject } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { view, lensProp, compose } from 'ramda';
import { History } from 'history';

import { getScenarioResults, IStateWithResult, IStepsResults } from '../../entities/result';
import { getAsset, requestsLens, IRequestData, RequestStatus } from '../../entities/network';
import { getMapByScenarioId, IMapInfo, IStateWithMap } from '../../entities/map';
import { ScenarioMapCssClasses, ScenarioMapDataAttrs, Results } from '../../constants/game';
import { AssetsPaths, AppRoutes } from '../../constants/urls';

const PERFORMANCE_TO_CSS_CLASS = {
    [Results.Normal]: ScenarioMapCssClasses.NormalPerformance,
    [Results.Good]: ScenarioMapCssClasses.GoodPerformance,
    [Results.Best]: ScenarioMapCssClasses.BestPerformance,
};

const capitalize = (word: string) => word.split('').map((el, i) => i === 0 ? el.toUpperCase() : el).join('');
const snakeToCamel = (str: string) => str
    .split('-')
    .map((el, i) => i > 0 ? capitalize(el) : el)
    .join('');

function getUrlWithPathParams(url: string, pathParams: { [key: string]: string; }) {
    return Object.entries(pathParams).reduce((url, [param, value]) => {
        return url.replace(`:${param}`, value);
    }, url);
}

function setLevelsResults(
    scenarioId: string,
    results: { [key: string]: Results; },
    map: IMapInfo[],
    history: History,
    mapContainer: RefObject<HTMLDivElement>,
) {
    if (!mapContainer.current) return;
    
    const levelsNodes = document.querySelectorAll(`[data-${ScenarioMapDataAttrs.Level}]`);
    Array.prototype.forEach.call(levelsNodes, (node: HTMLElement) => {
        const key = snakeToCamel(ScenarioMapDataAttrs.Level);
        const stepNumData = node.dataset[key];

        if (!stepNumData) {
            throw new Error('No html element');
        }

        const stepNumberFromHTML = +stepNumData;
        const css = node.classList;
        const { openOnStepSolved = null } = map.find(item => item.id === stepNumberFromHTML) || {};
        const isAddDisabled = stepNumberFromHTML > 0
            && openOnStepSolved !== null
            && !results.hasOwnProperty(String(openOnStepSolved));

        if (isAddDisabled) {
            css.add(ScenarioMapCssClasses.Disabled);
        } else if (results.hasOwnProperty(stepNumberFromHTML)) {
            const type = results[stepNumberFromHTML];

            css.add(PERFORMANCE_TO_CSS_CLASS[type]);
        }

        if (!isAddDisabled) {
            node.addEventListener('click', () => {
                const urlScenarioId = getUrlWithPathParams(AppRoutes.ScenarioPlay, {
                    scenarioId,
                    stepId: String(stepNumberFromHTML),
                });
            
                history.push(urlScenarioId);
            });
        }
    });
}

const key = lensProp('scnearioMapRequest');

export default function ScenarioMap() {
    const [html, setHtml] = useState('');
    const dispatch = useDispatch();
    const mapContainer = useRef(null);
    const { scenarioId } = useParams();
    const history = useHistory();
    const req = useSelector(
        compose(
            view(key),
            view(requestsLens)
        )
    ) as IRequestData<string>;
    const results = useSelector<
        IStateWithResult,
        IStepsResults
    >(getScenarioResults(scenarioId));
    const map = useSelector<
        IStateWithMap,
        IMapInfo[]
    >(getMapByScenarioId(scenarioId));

    useEffect(() => {
        const headers = new Headers();
        headers.append('Content-Type', 'text/plain;charset=utf-8');

        dispatch(
            getAsset({
                key,
                path: AssetsPaths.Map,
                pathParams: { scenarioId },
                headers,
            })
        );
    }, [dispatch, scenarioId]);

    useEffect(() => {
        if (req && req.status === RequestStatus.Success && req.data) {
            (req.data as unknown as Blob).text().then(text => setHtml(text));
        }
    }, [req, html]);

    useEffect(() => {
        setLevelsResults(
            scenarioId,
            results,
            map,
            history,
            mapContainer,
        )
    }, [scenarioId, results, map, history, mapContainer, html]);

    if (!req) {
        return (
            <div>Suspense...</div>
        );
    }

    return (
        req.status === RequestStatus.Fail
            ? <div>Error</div>
            : !req.data || req.status === RequestStatus.Pending || !html
            ? <div>Suspense...</div>
            : <div ref={ mapContainer } dangerouslySetInnerHTML={{ __html: html }}></div>
    );
}
