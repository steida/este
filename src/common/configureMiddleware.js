import createLoggerMiddleware from 'redux-logger';
import validate from './validate';

// Like redux-thunk but with dependency injection.
const injectMiddleware = deps => ({ dispatch, getState }) => next => action =>
  next(typeof action === 'function'
    ? action({ ...deps, dispatch, getState })
    : action
  );

// Like redux-promise-middleware but simpler.
const promiseMiddleware = options => ({ dispatch }) => next => action => {
  const { shouldThrow } = options || {};
  const { payload } = action;
  const payloadIsPromise = payload && typeof payload.then === 'function';
  if (!payloadIsPromise) return next(action);
  const createAction = (suffix, payload) => ({
    type: `${action.type}_${suffix}`, meta: { action }, payload,
  });
  // Note we don't return promise.
  // github.com/este/este/issues/1091
  payload
    .then(value => dispatch(createAction('SUCCESS', value)))
    .catch(error => {
      dispatch(createAction('ERROR', error));
      // Not all errors need to be reported.
      if (shouldThrow(error)) {
        throw error;
      }
    });
  return next(createAction('START'));
};

const configureMiddleware = (initialState, platformDeps, platformMiddleware) => {
  const middleware = [
    injectMiddleware({
      ...platformDeps,
      getUid: () => platformDeps.uuid.v4(),
      now: () => Date.now(),
      validate,
    }),
    promiseMiddleware({
      shouldThrow: error => error,
    }),
    ...platformMiddleware,
  ];

  const enableLogger = process.env.NODE_ENV !== 'production' && (
    process.env.IS_BROWSER || initialState.device.isReactNative
  );

  // Logger must be the last middleware in chain.
  if (enableLogger) {
    const ignoredActions = [];
    const logger = createLoggerMiddleware({
      collapsed: true,
      predicate: (getState, action) => ignoredActions.indexOf(action.type) === -1,
      // Convert immutable to JSON.
      stateTransformer: state => JSON.parse(JSON.stringify(state)),
    });
    middleware.push(logger);
  }

  return middleware;
};

export default configureMiddleware;
