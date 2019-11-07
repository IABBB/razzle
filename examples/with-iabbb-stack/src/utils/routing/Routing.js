import React from 'react';
import PropTypes from 'prop-types';
import renderRoutes from './renderRoutes';

// Must be defined like this otherwise webpack compiles it wrong
const Route = require('react-router-dom').Route;
const Switch = require('react-router-dom').Switch;
// import { Switch } from 'react-router-dom';
// import renderRoutes from 'utils/routing/renderRoutes';

const Routing = ({ router: Router, routes, ...props }) => (
  <Router {...props}>
    <Switch>{renderRoutes(routes)}</Switch>
  </Router>
);

Routing.propTypes = {
  router: PropTypes.func.isRequired,
  routes: PropTypes.array.isRequired,
};

export default Routing;
