import React from 'react';
import Koa from 'koa';
import serve from 'koa-static';
import helmet from 'koa-helmet';
import Router from 'koa-router';
import { renderToString } from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';
import { ServerStyleSheets } from '@material-ui/core/styles';
import { ChunkExtractor } from '@loadable/server';
import App from './apps/Website/App';

const path = require('path');
const fs = require('fs-extra');

const StaticRouter = require('react-router-dom').StaticRouter;

const locale = 'es';
const appName = `site_${locale}`;

// Initialize `koa-router` and setup a route listening on `GET /*`
// Logic has been splitted into two chained middleware functions
// @see https://github.com/alexmingoia/koa-router#multiple-middleware
const router = new Router();
router.get(
  '/*',
  (ctx, next) => {
    const extractor = new ChunkExtractor({
      statsFile: path.resolve(process.env.PUBLIC_DIR, `${appName}.loadable.json`),
      entrypoints: [appName],
    });

    // const assets = fs.readJsonSync(path.join(process.env.PUBLIC_DIR, `${appName}.assets.json`));

    // Create the server side style sheet
    const styledSheet = new ServerStyleSheet();
    const materialSheet = new ServerStyleSheets();
    const context = {};

    const markup = renderToString(
      extractor.collectChunks(
        styledSheet.collectStyles(
          materialSheet.collect(
            <App locale={locale}>
              {({ Controller }) => <Controller router={StaticRouter} location={ctx.url} context={context} />}
            </App>
          )
        )
      )
    );

    // Generate all the style tags so they can be rendered into the page
    ctx.state.styles = {
      styledSheet: styledSheet.getStyleTags(),
      materialSheet: materialSheet.toString(),
    };

    ctx.state.markup = markup;
    ctx.state.scripts = extractor.getScriptTags();
    return context.url ? ctx.redirect(context.url) : next();
  },
  (ctx) => {
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
            ctx.state.scripts
            // process.env.NODE_ENV === 'production'
            //   ? `<script src="${ctx.state.assets.site_en.js}" defer></script>`
            //   : `<script src="${ctx.state.assets.site_en.js}" defer crossorigin></script>`
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
  // Serve static files located under `process.env.PUBLIC_DIR`
  .use(serve(process.env.PUBLIC_DIR))
  .use(router.routes())
  .use(router.allowedMethods());

export default server;
