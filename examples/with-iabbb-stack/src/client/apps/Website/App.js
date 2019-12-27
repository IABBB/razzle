import MuiThemeProvider from '@material-ui/styles/ThemeProvider';
import PropTypes from 'prop-types';
import React from 'react';
import GlobalStyles from '../../styles/GlobalStyles';
import theme from '../../styles/theme';
import Routing from '../../utils/routing/Routing';
import routes from './routes';
import I18nProvider from '../../utils/i18n/Provider';

const Controller = (props) => <Routing {...props} routes={routes} />;

export default class App extends React.Component {
  static displayName = 'App';

  static propTypes = {
    children: PropTypes.func.isRequired,
    // store: PropTypes.object.isRequired,
    locale: PropTypes.string,
    isSSR: PropTypes.bool,
  };

  static defaultProps = {
    locale: 'en',
    isSSR: false,
  };

  render() {
    const { children, locale, isSSR } = this.props;
    return (
      <MuiThemeProvider theme={theme}>
        <I18nProvider locale={locale} isSSR={isSSR}>
          {children({ Controller })}
        </I18nProvider>
        <GlobalStyles />
      </MuiThemeProvider>
    );
  }
}
