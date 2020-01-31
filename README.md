# React Build Engine

This started off as a fork of [Razzle](https://github.com/jaredpalmer/razzle), but ended up as an essential rewrite of Razzle.  It still contains some of the [razzle-dev-utils](https://github.com/jaredpalmer/razzle/tree/master/packages/razzle-dev-utils), however the scripts have been significantly updated and paired down.  It also showcases a single example using the stack we primarily use here at IABBB.

There remains a signficant number of improvements that can be made.  The co-dependence and fragility of the `paths.js` and `env.js` in the [config](https://github.com/IABBB/razzle/tree/master/packages/razzle/config) directory under the [razzle](https://github.com/IABBB/razzle/tree/master/packages/razzle) package is worrisome.  In any case, this seems like a decent start and it is a base that we can build upon.

## Example Use-Cases

Navigate to `with-iabbb-stack`

```bash
yarn install
yarn start
```

Then open http://localhost:3000/ to see your app.

## Updating Dependencies in [packages](https://github.com/IABBB/razzle/tree/master/packages)

At the **root** of the repo, run

```bash
yarn upgrade-interactive --latest
```

Choose which packages to upgrade.
