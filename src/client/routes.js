//import Examples from './examples/page.react';
import App from './app/app.react';
import Home from './home/index.react';
//import Login from './auth/index.react';
import Me from './me/index.react';
import NotFound from './components/notfound.react';
import React from 'react';
import Todos from './todos/index.react';
import Users from './users/index.react';
import TodoPage from './todos/todoPage.react';
import Login from './auth/loginPage.react';
import Layout from './app/layout/layout.react';
import {DefaultRoute, NotFoundRoute, Route} from 'react-router';

export default (
    <Route handler={App}>
        <Route handler={Login} name="login" />
        <Route handler={Layout} path="/">
            <DefaultRoute handler={Home} name="home" />
            <NotFoundRoute handler={NotFound} name="not-found" />
            {/*<Route handler={Examples} name="examples" />*/}
            <Route handler={Me} name="me" />
            <Route handler={Todos} name="todos" />
            <Route handler={TodoPage} name="todo" path="todos/:id" />
            <Route handler={Users} name="users" />
        </Route>
    </Route>
);
