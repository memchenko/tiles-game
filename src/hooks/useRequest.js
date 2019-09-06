import { useReducer } from 'react';
import axios from 'axios';

const REQUEST = 0;
const SUCCESS = 1;
const FAIL = -1;

const initialState = { isPending: false, data: null, error: null };

function reducer(state, action) {
    switch (action.type) {
        case REQUEST: {
            return { ...state, isPending: true };
        }
        case SUCCESS: {
            return { isPending: false, data: action.payload, error: null };
        }
        case FAIL: {
            return { isPending: false, data: null, error: action.payload };
        }
        default: {
            return state;
        }
    }
}

export default function useRequest() {
    const [state, dispatch] = useReducer(reducer, initialState);

    const request = (options) => {
        dispatch({ type: REQUEST });

        axios(options)
            .then(({ data }) => dispatch({ type: SUCCESS, payload: data }))
            .catch(payload => dispatch({ type: FAIL, payload }));
    };

    return [state, request];
}
