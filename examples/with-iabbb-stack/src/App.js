import MuiThemeProvider from '@material-ui/styles/ThemeProvider';
import PropTypes from 'prop-types';
import React from 'react';
import GlobalStyles from './styles/GlobalStyles';
import theme from './styles/theme';
import Routing from './utils/routing';

const Controller = props => <Routing {...props} />;

export default class App extends React.Component {
  static displayName = 'App';

  static propTypes = {
    children: PropTypes.func.isRequired,
    store: PropTypes.object.isRequired,
  };

  render() {
    const { children, store } = this.props;

    return (
      <MuiThemeProvider theme={theme}>
        {children({ Controller })}
        <GlobalStyles />
      </MuiThemeProvider>
    );
  }
}
