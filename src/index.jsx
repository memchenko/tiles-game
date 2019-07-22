import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

import ServicesContext from '_contexts/ServicesContext/ServicesContext';
import services from '_services/index';

ReactDOM.render(
    <ServicesContext.Provider value={services}>
        <App />
    </ServicesContext.Provider>,
    document.getElementById('app')
);
