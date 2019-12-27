import React from 'react';

const Route = require('react-router-dom').Route;

const renderRoutes = (routes) =>
  routes.map((route) => {
    // support string path
    const routePaths = Array.isArray(route.path) ? route.path : [route.path];
    return routePaths.map((routePath, index) => {
      // ensure unique id
      const id = `${route.id}_${index}`;
      // deafult to true if undefined
      const additionalProps = {
        path: routePath,
        id,
        exact: route.exact === undefined || route.exact,
      };
      const _route = { ...route, ...additionalProps };
      return (
        <Route
          path={_route.path}
          exact={_route.exact} // default to true
          render={(props) => (
            // pass the sub-routes down to keep nesting
            <_route.component {...props} routes={_route.routes} />
          )}
        />
      );
    });
  });
export default renderRoutes;
