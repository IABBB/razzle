import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { withRouter } from 'react-router';
import { compose } from 'redux';
// import logo from '../../koajs-logo.png';
import StyledHome from './styles';
import LocaleSelect from '../LocaleSelect';
import withText from './text/withText';

class Home extends React.Component {
  // state = {
  //   locale: qs.parse(this.props.location.search).locale,
  // };

  static propTypes = {
    location: PropTypes.object.isRequired,
    text: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    // __text: PropTypes.object.isRequired,
  };

  render() {
    // console.log(`HOME RENDER --- locale is ${this.state.locale}`);
    const { text, locale } = this.props;
    return (
      <StyledHome>
        <StyledHome.Header>
          {/* <StyledHome.LogoImg src={logo} alt="logo" /> */}
          <h2>{text.title}</h2>
          {/* <h2>{this.props.__text.title}</h2> */}
        </StyledHome.Header>
        <StyledHome.Intro>
          <StyledHome.LocaleSelect>
            <div>Set Locale: </div>
            <LocaleSelect locale={locale} />
          </StyledHome.LocaleSelect>
          To get started, edit <b>src/App.js</b> or somethings
          <b>src/components/Home.js</b> and save to reload.
        </StyledHome.Intro>
        <StyledHome.ResourcesList>
          <li>
            <Button variant="outlined" href="https://github.com/jaredpalmer/razzle">
              Docs
            </Button>
          </li>
          <li>
            <Button variant="outlined" color="secondary" href="http://koajs.com">
              Koa official site
            </Button>
          </li>
          <li>
            <Button variant="outlined" href="https://github.com/jaredpalmer/razzle/issues">
              Issues
            </Button>
          </li>
          <li>
            <Button variant="outlined" href="https://palmer.chat">
              Community Slack
            </Button>
          </li>
        </StyledHome.ResourcesList>
      </StyledHome>
    );
  }
}

export default compose(withRouter, withText)(Home);
