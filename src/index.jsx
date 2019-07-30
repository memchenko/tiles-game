import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

import ServicesContext, { services } from './contexts/ServicesContext/ServicesContext';

ReactDOM.render(
    <ServicesContext.Provider value={ services }>
        <App />
    </ServicesContext.Provider>,
    document.getElementById('app')
);
