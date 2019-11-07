import App from './App';
import React from 'react';
import { hydrate, render } from 'react-dom';
import { loadableReady } from '@loadable/component';
// import { BrowserRouter } from 'react-router';
const BrowserRouter = require('react-router-dom').BrowserRouter;
/* 
hydrate(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept();
}
*/

const routingProps = {
  router: BrowserRouter,
};

const container = document.getElementById('root');

// only try to hydrate if there is markup present
new Promise(resolve => {
  if (container.childElementCount) {
    // loadableReady().then(() => resolve(hydrate));
    resolve(hydrate);
  } else {
    resolve(render);
  }
})
  .then(compiler => {
    compiler(
      <App>{({ Controller }) => <Controller {...routingProps} />}</App>,
      container
    );
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
