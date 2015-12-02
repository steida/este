import React from 'react';
import ReactDOM from 'react-dom';
import Router from 'react-router';
import configureStore from '../common/configureStore';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import createEngine from 'redux-storage/engines/localStorage';
import createRoutes from './createRoutes';
import {IntlProvider} from 'react-intl';
import {Provider} from 'react-redux';
import {syncReduxAndRouter} from 'redux-simple-router';

// TODO: Add app storage example.
// import storage from 'redux-storage';

// Enabling ES7 `async/await` in browser:
if (process.env.IS_BROWSER) require('regenerator/runtime');

const app = document.getElementById('app');
const engine = createEngine('este-app');
const history = createBrowserHistory();
const initialState = window.__INITIAL_STATE__;
const store = configureStore({engine, initialState});
const routes = createRoutes(store.getState);

syncReduxAndRouter(history, store);

ReactDOM.render(
  <Provider store={store}>
    <IntlProvider>
      <Router history={history}>
        {routes}
      </Router>
    </IntlProvider>
  </Provider>,
  app,
  () => {
    // This is where state from local storage should be retrieved.
    // storage.createLoader(engine)(store);
  }
);
