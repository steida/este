// @flow
import type { State } from '../../common/types';
import HttpError from 'found/lib/HttpError';
import React from 'react';
import { makeRouteConfig, Route } from 'found/lib/jsx';

// Pages
import App from './App';
import FieldsPage from '../fields/FieldsPage';
import HomePage from '../home/HomePage';
import IntlPage from '../intl/IntlPage';
import MePage from '../me/MePage';
import OfflinePage from '../offline/OfflinePage';
import ProfilePage from '../me/ProfilePage';
import SettingsPage from '../me/SettingsPage';
import SignInPage from '../auth/SignInPage';
import TodosPage from '../todos/TodosPage';
import UsersPage from '../users/UsersPage';

const AuthorizedRoute = () => {};
AuthorizedRoute.createRoute = props => ({
  ...props,
  render: ({ Component, match, props }) => {
    const state: State = match.context.store.getState();
    if (!state.users.viewer) {
      throw new HttpError(401);
    }
    return <Component {...props} />;
  },
});

const routeConfig = makeRouteConfig(
  <Route path="/" Component={App}>
    <Route Component={HomePage} />
    <Route path="fields" Component={FieldsPage} />
    <Route path="intl" Component={IntlPage} />
    <AuthorizedRoute path="me" Component={MePage}>
      <Route path="profile" Component={ProfilePage} />
      <Route path="settings" Component={SettingsPage} />
    </AuthorizedRoute>
    <Route path="offline" Component={OfflinePage} />
    <Route path="signin" Component={SignInPage} />
    <Route path="todos" Component={TodosPage} />
    <Route path="users" Component={UsersPage} />
  </Route>,
);

export default routeConfig;
