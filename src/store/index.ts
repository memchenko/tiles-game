import { createStore, applyMiddleware, compose } from 'redux';
import { createEpicMiddleware, combineEpics } from 'redux-observable';
import { identity } from 'ramda'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import hardSet from 'redux-persist/lib/stateReconciler/hardSet'

import rootReducer from './rootReducer';
import { WindowWithReduxDevTools } from './types';

import { epics as networkEpics } from '../entities/network';
import { epics as playEpics } from '../entities/play';

const windowWithReduxDevTools = window as WindowWithReduxDevTools;
const devTools = windowWithReduxDevTools.__REDUX_DEVTOOLS_EXTENSION__
  ? windowWithReduxDevTools.__REDUX_DEVTOOLS_EXTENSION__()
  : identity;

const persistConfig = {
  key: 'app-state',
  storage,
  stateReconciler: hardSet,
  blacklist: ['network'],
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

  return { store, persistor };
};

epicMiddleware.run(combineEpics<any>(
  ...networkEpics,
  ...playEpics,
));

export default store;
