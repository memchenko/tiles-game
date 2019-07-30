import React, { useContext, useEffect, useState } from 'react';

import { Subscription } from 'rxjs';

import ServicesContext from '_contexts/ServicesContext/ServicesContext';
import getDisplayedName from '_utils/dev';

export default function withStore(WrappedComponent, fields) {
    function Wrapper(props, context) {
        const [state, setState] = useState({});

        useContext(ServicesContext);
        useEffect(() => {
            const subscription = new Subscription();

            subscription.add(context.store.subscribe((storeState) => {
                const updatedState = fields.reduce((acc, field) => {
                    acc[field] = storeState[field];
                    return acc;
                }, {});

                setState(updatedState);
            }));

            return () => subscription.unsubscribe();
        });

        return (
            <WrappedComponent
                {...state}
                {...props}
            />
        );
    }

    Wrapper.displayName = `withStore(${getDisplayedName(WrappedComponent)})`;

    return Wrapper;
}