import SCENARIOS_LIST from './scenarios';
import SCENARIOS_MAPS from './maps';

export default Object.assign({
    scenarios: {
        results: new Map([
            [0, []],
            [1, []],
            [2, []]
        ]),
        map: SCENARIOS_MAPS,
        descriptions: SCENARIOS_LIST
    }
});
