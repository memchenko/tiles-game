import { createReducer } from 'deox';

import { IScenarioState } from './types';
import { setScenario, updateScenario } from './actions';

import { Difficulties } from '../../constants/game';

const initialState: IScenarioState = {
    list: [
        {
            id: 0,
            order: 0,
            icon: 'https://avatars.dicebear.com/v2/jdenticon/birds.svg',
            title: 'Explore Birds',
            difficulty: Difficulties.Easy,
            poster: 'https://avatars.dicebear.com/v2/jdenticon/birds.svg',
            progress: 0,
            description: 'Learn more about birds species with "Explore Brids" puzzles',
        },
        {
            id: 1,
            order: 1,
            icon: 'https://avatars.dicebear.com/v2/jdenticon/trees.svg',
            title: 'Explore Trees',
            difficulty: Difficulties.Easy,
            poster: 'https://avatars.dicebear.com/v2/jdenticon/trees.svg',
            progress: 0.33,
            description: 'Learn more about trees species with "Explore Trees" puzzles',
        },
        {
            id: 2,
            order: 2,
            icon: 'https://avatars.dicebear.com/v2/jdenticon/space.svg',
            title: 'Explore Space',
            difficulty: Difficulties.Easy,
            poster: 'https://avatars.dicebear.com/v2/jdenticon/space.svg',
            progress: 0.66,
            description: 'Learn more about Space with "Explore Space" puzzles',
        },
    ],
};

export default createReducer(initialState, handle => ([
    handle(
        setScenario,
        (state, action) => ({
            ...state,
            list: action.payload.slice().sort((a, b) => a.order - b.order),
        }),
    ),
    handle(
        updateScenario,
        (state, action) => {
            const list = state.list.map((scenario) => (
                scenario.id === action.payload.id
                    ? { ...action.payload }
                    : { ...scenario }
            ));

            return {
                ...state,
                list,
            };
        }
    ),
]));