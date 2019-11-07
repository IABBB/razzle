import App from './App';
import React from 'react';
import Koa from 'koa';
import serve from 'koa-static';
import helmet from 'koa-helmet';
import Router from 'koa-router';
import { renderToString } from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';
import { ServerStyleSheets } from '@material-ui/core/styles';
// import { ChunkExtractor } from '@loadable/server';

const StaticRouter = require('react-router-dom').StaticRouter;

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

// Initialize `koa-router` and setup a route listening on `GET /*`
// Logic has been splitted into two chained middleware functions
// @see https://github.com/alexmingoia/koa-router#multiple-middleware
const router = new Router();
router.get(
  '/*',
  (ctx, next) => {
    // Create the server side style sheet
    const styledSheet = new ServerStyleSheet();
    const materialSheet = new ServerStyleSheets();
    const context = {};

    const markup = renderToString(
      styledSheet.collectStyles(
        materialSheet.collect(
          <App>
            {({ Controller }) => (
              <Controller
                router={StaticRouter}
                location={ctx.url}
                context={context}
              />
            )}
          </App>
        )
      )
    );

    // Generate all the style tags so they can be rendered into the page
    ctx.state.styles = {
      styledSheet: styledSheet.getStyleTags(),
      materialSheet: materialSheet.toString(),
    };

    ctx.state.markup = markup;
    return context.url ? ctx.redirect(context.url) : next();
  },
  ctx => {
    ctx.status = 200;
    ctx.body = `
    <!doctype html>
      <html lang="">
      <head>
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta charset="utf-8" />
          <title>Welcome to Razzle + IABBB</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <div id="ssr-styles">
            ${ctx.state.styles.styledSheet}
            <style>
              ${ctx.state.styles.materialSheet}
            </style>
          </div>
          ${
            process.env.NODE_ENV === 'production'
              ? `<script src="${assets.client.js}" defer></script>`
              : `<script src="${assets.client.js}" defer crossorigin></script>`
          }
      </head>
      <body>          
          <div id="root">${ctx.state.markup}</div>
      </body>
    </html>`;
  }
);

// Intialize and configure Koa application
const server = new Koa();
server
  // `koa-helmet` provides security headers to help prevent common, well known attacks
  // @see https://helmetjs.github.io/
  .use(helmet())
  // Serve static files located under `process.env.RAZZLE_PUBLIC_DIR`
  .use(serve(process.env.RAZZLE_PUBLIC_DIR))
  .use(router.routes())
  .use(router.allowedMethods());

export default server;
