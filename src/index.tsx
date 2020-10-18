import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';
import { PersistGate } from 'redux-persist/integration/react'
import { BrowserRouter as Router } from 'react-router-dom';

import App from './App';
import createStore from './store';
import Ads from './components/Ads';
import * as serviceWorker from './serviceWorker';
import './index.scss';

const { store, persistor } = createStore();

ReactDOM.render(
  <React.StrictMode>
    <Provider store={ store }>
      <PersistGate loading={ null } persistor={ persistor }>
        <AppContainer>
          <Router>
            <App />
          </Router>
        </AppContainer>
      </PersistGate>
    </Provider>
    <Ads />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
