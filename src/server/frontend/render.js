<<<<<<< HEAD:src/server/frontend/render.js
<<<<<<< HEAD
import config from './config';
import DocumentTitle from 'react-document-title';
import Html from './html.react';
import initialState from './initialstate';
import Immutable from 'immutable';
import Promise from 'bluebird';
import React from 'react';
import Router from 'react-router';
<<<<<<< HEAD:src/server/render.js
import routes from '../client/routes';
import {state} from '../client/state';
=======
import config from '../config';
import initialState from '../initialstate';
=======
import config from '../config';
import DocumentTitle from 'react-document-title';
import Html from './html.react';
import initialState from '../initialstate';
import Promise from 'bluebird';
import React from 'react';
import Router from 'react-router';
>>>>>>> Alphabetical order FTW
import routes from '../../client/routes';
import {state} from '../../client/state';
>>>>>>> Initial commit -> first part of refactor done:src/server/frontend/render.js
=======
import config from '../config';
import DocumentTitle from 'react-document-title';
import Html from './html.react';
import initialState from '../initialstate';
import Promise from 'bluebird';
import React from 'react';
import Router from 'react-router';
import routes from '../../client/routes';
import {state} from '../../client/state';
>>>>>>> 94050d42c1788e6a397259b5acae75fcd84194fc:src/server/frontend/render.js

export default function render(req, res, preloadedState) {
  const url = req.originalUrl;
  const baseState = Immutable.fromJS(initialState);
  const userState = Immutable.fromJS(preloadedState);
  const appState = baseState.mergeDeep(userState);
  return renderPage(res, appState, url);
}

// TODO: Refactor.
function renderPage(res, appState, url) {
  return new Promise((resolve, reject) => {
    const router = Router.create({
      routes,
      location: url,
      onError: reject,
      onAbort: (abortReason) => {
        // Some requireAuth higher order component requested redirect.
        if (abortReason.constructor.name === 'Redirect') {
          const {to, params, query} = abortReason;
          const path = router.makePath(to, params, query);
          res.redirect(path);
          resolve();
          return;
        }
        reject(abortReason);
      }
    });
    router.run((Handler, routerState) => {
      state.load(appState);
      const html = getPageHtml(Handler, appState);
      const notFound = routerState.routes.some(route => route.name === 'not-found');
      const status = notFound ? 404 : 200;
      res.status(status).send(html);
      resolve();
    });
  });
}

function getPageHtml(Handler, appState) {
  const appHtml = `<div id="app">${React.renderToString(<Handler />)}</div>`;
  const appScriptSrc = config.isProduction
    ? '/build/app.js?v=' + config.version
    : '//localhost:8888/build/app.js';

  let scriptHtml = `
    <script>
      (function() {
        window._appState = ${JSON.stringify(appState)};
        var app = document.createElement('script'); app.type = 'text/javascript'; app.async = true;
        var src = '${appScriptSrc}';
        // IE<11 and Safari need Intl polyfill.
        if (!window.Intl) src = src.replace('.js', 'intl.js');
        app.src = src;
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(app, s);
      })();
    </script>`;

  if (config.isProduction && config.googleAnalyticsId !== 'UA-XXXXXXX-X')
    scriptHtml += `
      <script>
        (function(b,o,i,l,e,r){b.GoogleAnalyticsObject=l;b[l]||(b[l]=
        function(){(b[l].q=b[l].q||[]).push(arguments)});b[l].l=+new Date;
        e=o.createElement(i);r=o.getElementsByTagName(i)[0];
        e.src='//www.google-analytics.com/analytics.js';
        r.parentNode.insertBefore(e,r)}(window,document,'script','ga'));
        ga('create','${config.googleAnalyticsId}');ga('send','pageview');
      </script>`;

  const title = DocumentTitle.rewind();

  return '<!DOCTYPE html>' + React.renderToStaticMarkup(
    <Html
      bodyHtml={appHtml + scriptHtml}
      isProduction={config.isProduction}
      title={title}
      version={config.version}
    />
  );
}
