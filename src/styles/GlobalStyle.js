import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  :root {
    /* --green: #6FD65E;
    --green-light: #D5FFCE;
    --pink: #EB5BEE;
    --pink-light: #feccff;
    --pink-lighter: #FFE5E5;
    --blue: #1472FF;
    --blue-light: #B6D3FF;
    --gray-darker: #808080;
    --gray-dark: #A7A7A7;
    --gray: #E0E0E0;
    --gray-light: #EDEDED;
    --gray-lighter: #F3F3F3;
    --gray-lighest: #F8F9FB;
    --black: #444444; */
    --purple: #250055;
    --plum: #1D0535;
    --periwinkle-base: 130, 135, 255;
    --periwinkle: rgb(var(--periwinkle-base));
    --lavendar-base: 248, 221, 255;
    --lavendar: rgb(var(--lavendar-base));
    --pink: #FF79ED;
    --background: #23024B;
    --background-dark: #1F043C;
    --bubble-gum: #FF79ED;
    --green: #00FF38;

    --radius-default: 8px;
  }
  
  * {
    box-sizing: border-box;
  }

  html {
    height: 100%;
  }

  body {
    height: 100%;
    margin: 0;
    font-family: 'Comfortaa', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-size: 16px;
    background-color: var(--background);
    color: var(--lavendar);
  }

  #root {
    height: 100%;
  }

  .app {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .content {
    flex: 1 0 auto;
    margin-top: -93px;
    
    .buttons-bottom {
      position: sticky;
      bottom: 0;
      z-index: 2;
    }
  }

  .footer {
    flex-shrink: 0;
  }
  
  a {
    color: var(--periwinkle);
    text-decoration: none;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
  }
`;

export default GlobalStyle;
