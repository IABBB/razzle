import React from 'react';
import PropTypes from 'prop-types';
import Home from '../../components/Home';
// Must be defined like this otherwise webpack compiles it wrong
const Route = require('react-router-dom').Route;
const Switch = require('react-router-dom').Switch;
// import { Switch } from 'react-router-dom';
// import renderRoutes from 'utils/routing/renderRoutes';

const Routing = ({ router: Router, ...props }) => (
  <Router {...props}>
    <Switch>
      <Route exact path="/" component={Home} />
    </Switch>
  </Router>
);

Routing.propTypes = {
  router: PropTypes.func.isRequired,
};

export default Routing;
