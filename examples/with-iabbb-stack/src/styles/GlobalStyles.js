import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
    body, html {
    margin: 0;
    padding: 0;
    height: 100%;
    }

    body {
    font: 17px/1.5 "Lucida Grande", "Lucida Sans Unicode", Helvetica, Arial, Verdana, sans-serif;
    background: white;
    color: #33333d;
    overflow-y: scroll;
    overflow-x: hidden;
    }

    a {
    color: #33a0c0;
    }
`;

export default GlobalStyles;
