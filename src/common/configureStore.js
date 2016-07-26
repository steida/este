import configureReducer from './configureReducer';
import configureMiddleware from './configureMiddleware';
import { applyMiddleware, createStore, compose } from 'redux';

export default function configureStore(options) {
  const {
    initialState,
    platformDeps = {},
    platformMiddleware = [],
    platformReducers = {},
  } = options;

  const reducer = configureReducer(
    initialState,
    platformReducers
  );

  const middleware = configureMiddleware(
    initialState,
    platformDeps,
    platformMiddleware
  );

  const store = createStore(
    reducer,
    initialState,
    compose(
      applyMiddleware(...middleware),
      typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ?
        window.devToolsExtension() : f => f
    )
  );

  // Enable hot reload where available.
  if (module.hot) {
    const replaceReducer = configureReducer =>
      store.replaceReducer(configureReducer(initialState, platformReducers));

    if (initialState.device.isReactNative) {
      module.hot.accept(() => {
        replaceReducer(require('./configureReducer').default);
      });
    } else {
      module.hot.accept('./configureReducer', () => {
        replaceReducer(require('./configureReducer'));
      });
    }
  }

  return store;
}
