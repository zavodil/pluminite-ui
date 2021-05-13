import React from 'react';
import { HashRouter as Router, Switch } from 'react-router-dom';

import { Page } from './router';

import Navigation from './components/Navigation';
import Home from './components/Home';
import SignUp from './components/SignUp';
import LogIn from './components/LogIn';

import GlobalStyle from './styles/GlobalStyle';

export default function App() {
  return (
    <>
      <GlobalStyle />
      <div className="app">
        <Router>
          <Navigation />
          <div className="content">
            <Switch>
              <Page exact path="/" component={Home} />
              <Page exact path="/sign-up" component={SignUp} title="Sign up" />
              <Page exact path="/log-in" component={LogIn} title="Log in" />
            </Switch>
          </div>
          <div className="footer" />
        </Router>
      </div>
    </>
  );
}
