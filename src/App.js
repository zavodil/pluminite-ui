import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';

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
              <Route exact path="/" component={Home} />
              <Route exact path="/sign-up" component={SignUp} />
              <Route exact path="/log-in" component={LogIn} />
            </Switch>
          </div>
          <div className="footer" />
        </Router>
      </div>
    </>
  );
}
