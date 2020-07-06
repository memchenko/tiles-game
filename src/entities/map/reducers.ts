import { createReducer } from 'deox';

import { IMapState } from './types';
import { setMap } from './actions';

const initialState: IMapState = {
    list: {
        '0': [
            {
                id: 0,
                scenarioId: 0,
                matrix: [[{ color: 'black' }, { color: 'white' }], [{ color: 'white' }, { color: 'black' }]],
                performance: { best: 2, good: 3, normal: 4 },
                estimationType: 'steps',
                isShowExample: true,
                title: 'Pigeon',
                isLast: false,
                htmlDescriptionOnEnd: 'Usual bird',
                openOnStepSolved: null,
                isImage: false,
            },
            {
                id: 1,
                scenarioId: 0,
                matrix: [[{ color: '#ec4' }, { color: '#d4d' }], [{ color: '#4e4' }, { color: '#d4d' }]],
                performance: { best: 2, good: 3, normal: 4 },
                estimationType: 'steps',
                isShowExample: true,
                title: 'Owl',
                isLast: false,
                htmlDescriptionOnEnd: 'Forest bird',
                openOnStepSolved: 0,
                isImage: false,
            },
            {
                id: 2,
                scenarioId: 0,
                matrix: [[{ color: 'black' }, { color: 'black' }, { color: 'white' }], [{ color: 'white' }, { color: 'black' }, { color: 'white' }], [{ color: 'white' }, { color: 'black' }, { color: 'black' }]],
                performance: { best: 2, good: 3, normal: 4 },
                estimationType: 'steps',
                isShowExample: true,
                title: 'One more bird',
                isLast: false,
                htmlDescriptionOnEnd: 'Whoa really bird',
                openOnStepSolved: 1,
                isImage: false,
            },
            {
                id: 3,
                scenarioId: 0,
                matrix: [[{ color: '#d44' }, { color: '#dd4' }, { color: '#d4d' }], [{ color: '#d4d' }, { color: '#d44' }, { color: '#dd4' }], [{ color: '#dd4' }, { color: '#d4d' }, { color: '#d44' }]],
                performance: { best: 2, good: 3, normal: 4 },
                estimationType: 'steps',
                isShowExample: true,
                title: 'Final',
                isLast: true,
                htmlDescriptionOnEnd: 'It was boss!',
                openOnStepSolved: 1,
                isImage: false,
            }
        ],
        '1': [
            {
                id: 0,
                scenarioId: 1,
                matrix: [[{ color: 'black' }, { color: 'white' }], [{ color: 'white' }, { color: 'black' }]],
                performance: { best: 2, good: 3, normal: 4 },
                estimationType: 'steps',
                isShowExample: true,
                title: 'Christmas tree',
                isLast: false,
                htmlDescriptionOnEnd: 'Trees on X-mas',
                openOnStepSolved: null,
                isImage: false,
            },
            {
                id: 1,
                scenarioId: 1,
                matrix: [[{ color: '#ec4' }, { color: '#d4d' }], [{ color: '#4e4' }, { color: '#d4d' }]],
                performance: { best: 2, good: 3, normal: 4 },
                estimationType: 'steps',
                isShowExample: true,
                title: 'Palm',
                isLast: false,
                htmlDescriptionOnEnd: 'Palms are south trees',
                openOnStepSolved: 0,
                isImage: false,
            },
            {
                id: 2,
                scenarioId: 1,
                matrix: [
                    [{ color: 'black' }, { color: 'black' }, { color: 'white' }],
                    [{ color: 'white' }, { color: 'black' }, { color: 'white' }],
                    [{ color: 'white' }, { color: 'black' }, { color: 'black' }]
                ],
                performance: { best: 2, good: 3, normal: 4 },
                estimationType: 'steps',
                isShowExample: true,
                title: 'Apple tree',
                isLast: false,
                htmlDescriptionOnEnd: 'Growing apples',
                openOnStepSolved: 1,
                isImage: false,
            },
            {
                id: 3,
                scenarioId: 1,
                matrix: [
                    [{ color: '#d44' }, { color: '#dd4' }, { color: '#d4d' }],
                    [{ color: '#d4d' }, { color: '#d44' }, { color: '#dd4' }],
                    [{ color: '#dd4' }, { color: '#d4d' }, { color: '#d44' }]
                ],
                performance: { best: 2, good: 3, normal: 4 },
                estimationType: 'steps',
                isShowExample: true,
                title: 'Final',
                isLast: true,
                htmlDescriptionOnEnd: 'It was boss!',
                openOnStepSolved: 2,
                isImage: false,
            }
        ],
        '2': [
            {
                id: 0,
                scenarioId: 2,
                matrix: [[{ color: 'black' }, { color: 'white' }], [{ color: 'white' }, { color: 'black' }]],
                performance: { best: 2, good: 3, normal: 4 },
                estimationType: 'steps',
                isShowExample: true,
                title: 'Earth',
                isLast: false,
                htmlDescriptionOnEnd: 'People\'s home',
                openOnStepSolved: null,
                isImage: false,
            },
            {
                id: 1,
                scenarioId: 2,
                matrix: [[{ color: '#ec4' }, { color: '#d4d' }], [{ color: '#4e4' }, { color: '#d4d' }]],
                performance: { best: 2, good: 3, normal: 4 },
                estimationType: 'steps',
                isShowExample: true,
                title: 'Mars',
                isLast: false,
                htmlDescriptionOnEnd: 'Fourth planet',
                openOnStepSolved: 0,
                isImage: false,
            },
            {
                id: 2,
                scenarioId: 2,
                matrix: [
                    [{color: 'black' }, { color: 'black' }, { color: 'white' }],
                    [{ color: 'white' }, { color: 'black' }, { color: 'white' }],
                    [{ color: 'white' }, { color: 'black' }, { color: 'black' }]
                ],
                performance: { best: 2, good: 3, normal: 4 },
                estimationType: 'steps',
                isShowExample: true,
                title: 'Pluto',
                isLast: false,
                htmlDescriptionOnEnd: 'Not a planet',
                openOnStepSolved: 1,
                isImage: false,
            },
            {
                id: 3,
                scenarioId: 2,
                matrix: [
                    [{ color: '#d44' }, { color: '#dd4' }, { color: '#d4d' }],
                    [{ color: '#d4d' }, { color: '#d44' }, { color: '#dd4' }],
                    [{ color: '#dd4' }, { color: '#d4d' }, { color: '#d44' }]
                ],
                performance: { best: 2, good: 3, normal: 4 },
                estimationType: 'steps',
                isShowExample: true,
                title: 'Sun',
                isLast: true,
                htmlDescriptionOnEnd: 'It was boss!',
                openOnStepSolved: 2,
                isImage: false,
            }
        ]
    },
};

export default createReducer(initialState, handle => ([
    handle(
        setMap,
        (state, action) => {
            const list = action.payload.reduce((acc, info) => {
                const key = String(info.scenarioId);

                if (acc[key]) {
                    acc[key].push(info);
                } else {
                    acc[key] = [info];
                }

                return acc;
            }, {} as IMapState['list']);

            return {
                ...state,
                list,
            };
        },
    ),
]));