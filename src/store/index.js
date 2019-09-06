import SCENARIOS_LIST from './scenarios';
import SCENARIOS_MAPS from './maps';

export default Object.assign({
    scenarios: {
        results: new Map([
            [0, new Map([
                [0, { type: 'best' }],
                [1, { type: 'normal' }]
            ])],
            [1, new Map()],
            [2, new Map()]
        ]),
        maps: SCENARIOS_MAPS,
        descriptions: SCENARIOS_LIST
    }
});
