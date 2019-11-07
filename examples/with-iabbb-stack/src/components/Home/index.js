import React from 'react';
import Button from '@material-ui/core/Button';
import logo from '../../koajs-logo.png';
import StyledHome from './styles';

class Home extends React.Component {
  render() {
    return (
      <StyledHome>
        <StyledHome.Header>
          <StyledHome.LogoImg src={logo} alt="logo" />
          <h2>Welcome to Razzle + IABBB</h2>
        </StyledHome.Header>
        <StyledHome.Intro>
          To get started, edit <b>src/App.js</b> or{' '}
          <b>src/components/Home.js</b> and save to reload.
        </StyledHome.Intro>
        <StyledHome.ResourcesList>
          <li>
            <Button
              variant="outlined"
              href="https://github.com/jaredpalmer/razzle"
            >
              Docs
            </Button>
          </li>
          <li>
            <Button
              variant="outlined"
              color="secondary"
              href="http://koajs.com"
            >
              Koa official site
            </Button>
          </li>
          <li>
            <Button
              variant="outlined"
              href="https://github.com/jaredpalmer/razzle/issues"
            >
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

export default Home;
