import React from 'react';
import Koa from 'koa';
import serve from 'koa-static';
import helmet from 'koa-helmet';
import Router from 'koa-router';
import logger from 'koa-logger';
import { renderToString } from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';
import { ServerStyleSheets } from '@material-ui/core/styles';
import { ChunkExtractor } from '@loadable/server';
import App from '../client/apps/Website/App';
import { LOCALE_COOKIE } from '../client/utils/cookie/names';

const path = require('path');

const StaticRouter = require('react-router-dom').StaticRouter;

const LOCALE_COOKIE_NAME = 'iabbb_locale';

// Initialize `koa-router` and setup a route listening on `GET /*`
// Logic has been splitted into two chained middleware functions
// @see https://github.com/alexmingoia/koa-router#multiple-middleware
const router = new Router();
router.get(
  '/*',
  (ctx, next) => {
    const locale = ctx.request.query.locale || ctx.cookies.get(LOCALE_COOKIE) || 'en';
    const appName = `site_${locale}`;

    const extractor = new ChunkExtractor({
      statsFile: path.resolve(process.env.PUBLIC_DIR, `${appName}.loadable.json`),
    });

    // console.log(`[SERVER] LOCALE ${locale}`);

    // const assets = fs.readJsonSync(path.join(process.env.PUBLIC_DIR, `${appName}.assets.json`));

    // Create the server side style sheet
    const styledSheet = new ServerStyleSheet();
    const materialSheet = new ServerStyleSheets();
    const context = {};

    const markup = renderToString(
      extractor.collectChunks(
        styledSheet.collectStyles(
          materialSheet.collect(
            <App locale={locale} isSSR>
              {({ Controller }) => <Controller router={StaticRouter} location={ctx.url} context={context} />}
            </App>,
          ),
        ),
      ),
    );

    // Generate all the style tags so they can be rendered into the page
    ctx.state.styles = {
      styledSheet: styledSheet.getStyleTags(),
      materialSheet: materialSheet.toString(),
    };

    ctx.state.markup = markup;
    ctx.state.scripts = extractor.getScriptTags();
    ctx.state.locale = locale;
    return context.url ? ctx.redirect(context.url) : next();
  },
  (ctx) => {
    const _d = new Date();
    _d.setDate(_d.getDate() + 1);
    ctx.cookies.set(LOCALE_COOKIE_NAME, ctx.state.locale, { expires: _d, httpOnly: false });
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
          ${ctx.state.scripts}
      </head>
      <body>          
          <div id="root">${ctx.state.markup}</div>
      </body>
    </html>`;
  },
);

// Intialize and configure Koa application
const server = new Koa();
server
  .use(logger())
  // `koa-helmet` provides security headers to help prevent common, well known attacks
  // @see https://helmetjs.github.io/
  .use(helmet())
  // Serve static files located under `process.env.PUBLIC_DIR`
  .use(serve(process.env.PUBLIC_DIR))
  .use(router.routes())
  .use(router.allowedMethods());

export default server;
