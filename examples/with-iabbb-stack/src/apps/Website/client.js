import React from 'react';
import { hydrate, render } from 'react-dom';
import { loadableReady } from '@loadable/component';
import App from './App';

const BrowserRouter = require('react-router-dom').BrowserRouter;

const routingProps = {
  router: BrowserRouter,
};

const container = document.getElementById('root');

// only try to hydrate if there is markup present
new Promise((resolve) => {
  if (container.childElementCount) {
    loadableReady().then(() => resolve(hydrate));
    // resolve(hydrate);
  } else {
    resolve(render);
  }
})
  .then((compiler) => {
    compiler(<App>{({ Controller }) => <Controller {...routingProps} />}</App>, container);
  })
  .then(() => {
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
