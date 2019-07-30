import React from 'react';

import Store from '_services/store';

const ServicesContext = React.createContext();

export const services = Object.freeze({
    store: new Store({})
});

export default ServicesContext;