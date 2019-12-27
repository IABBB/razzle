import Cookies from 'js-cookie';
import React from 'react';
import { hydrate, render } from 'react-dom';
import { loadableReady } from '@loadable/component';
import App from './App';
import { LOCALE_COOKIE } from '../../utils/cookie/names';

const BrowserRouter = require('react-router-dom').BrowserRouter;

const routingProps = {
  router: BrowserRouter,
};

const container = document.getElementById('root');

// only try to hydrate if there is markup present
new Promise((resolve) => {
  if (container.childElementCount) {
    loadableReady().then(() => resolve(hydrate));
    console.log('[CLIENT] Will hydrate');
  } else {
    resolve(render);
    console.log('[CLIENT] Will render');
  }
})
  .then((compiler) => {
    const locale = Cookies.get(LOCALE_COOKIE) || undefined;
    console.log(`Reading cookie ${LOCALE_COOKIE}=${locale}`);
    console.log('[CLIENT] Compiling');
    return compiler(<App locale={locale}>{({ Controller }) => <Controller {...routingProps} />}</App>, container);
  })
  .then(() => {
    console.log('[CLIENT] Compiling complete');
    const ssrStyles = document.getElementById('ssr-styles');
    if (ssrStyles) {
      requestAnimationFrame(() => {
        ssrStyles.parentNode.removeChild(ssrStyles);
      });
    }

    if (module.hot) {
      module.hot.accept();
    }
  });
