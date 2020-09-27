import { createStore, applyMiddleware, compose } from 'redux';
import { createEpicMiddleware, combineEpics } from 'redux-observable';
import { identity } from 'ramda'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import stateReconciler from 'redux-persist/lib/stateReconciler/autoMergeLevel1'

import rootReducer from './rootReducer';
import { WindowWithReduxDevTools } from './types';

import { epics as networkEpics } from '../entities/network';
import { epics as playEpics } from '../entities/play';
import { epics as appEpics } from '../entities/app';

const windowWithReduxDevTools = window as WindowWithReduxDevTools;
const devTools = windowWithReduxDevTools.__REDUX_DEVTOOLS_EXTENSION__
  ? windowWithReduxDevTools.__REDUX_DEVTOOLS_EXTENSION__()
  : identity;

const persistConfig = {
  key: 'app-state',
  storage,
  stateReconciler,
  blacklist: ['network', 'app'],
};

const persistedReducer = persistReducer<ReturnType<typeof rootReducer>>(persistConfig, rootReducer);

const epicMiddleware = createEpicMiddleware();
const store = () => {
  const store = createStore(
    persistedReducer,
    compose(
      applyMiddleware(epicMiddleware),
      devTools,
    ),
  );
  const persistor = persistStore(store);

  epicMiddleware.run(combineEpics<any>(
    ...networkEpics,
    ...playEpics,
    ...appEpics,
  ));

  return { store, persistor };
};

export default store;
