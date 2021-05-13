import React, { useContext } from 'react';
import { HashRouter as Router, Switch } from 'react-router-dom';

import { NearContext } from './contexts';

import { GuestPage, Page, UserPage } from './router';

import Navigation from './components/Navigation';
import Home from './components/Home';
import SignUp from './components/SignUp';
import LogIn from './components/LogIn';
import Mint from './components/Mint';

import GlobalStyle from './styles/GlobalStyle';

export default function App() {
  const { user, isLoading } = useContext(NearContext);

  const isAuthenticated = !!user;

  return (
    <>
      <GlobalStyle />
      <div className="app">
        <Router>
          <Navigation />
          <div className="content">
            <Switch>
              <Page exact path="/" component={Home} />
              <GuestPage
                exact
                path="/sign-up"
                component={SignUp}
                title="Sign up"
                isAuthenticated={isAuthenticated}
                isLoading={isLoading}
              />
              <GuestPage
                exact
                path="/log-in"
                component={LogIn}
                title="Log in"
                isAuthenticated={isAuthenticated}
                isLoading={isLoading}
              />
              <UserPage
                path="/mint"
                component={Mint}
                title="Mint a Gem"
                isAuthenticated={isAuthenticated}
                isLoading={isLoading}
              />
            </Switch>
          </div>
          <div className="footer" />
        </Router>
      </div>
    </>
  );
}
