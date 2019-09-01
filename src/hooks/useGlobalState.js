import { useState, useEffect } from 'react';
import { __, equals, view } from 'ramda';
import Store from '_services/store';

import INITIAL_GLOBAL_STATE from '_root/store';

const store = new Store(INITIAL_GLOBAL_STATE);

export default function useGlobalState(...lenses) {
    const globalState = store.getState();
    const [state, setState] = useState(lenses.map(view(__, globalState)));

    useEffect(() => {
        const subscription = store.$changed.subscribe((globalState) => {
            const values = lenses.map(view(__, globalState));
            
            if (!equals(state, values)) {
                setState(values);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    return state.concat(store.set);
}