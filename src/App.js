import React, { useContext } from 'react';
import { HashRouter as Router, Switch } from 'react-router-dom';
import { Zoom } from 'react-toastify';

import { NearContext } from './contexts';

import { GuestPage, Page, UserPage } from './router';

import StyledToastContainer from './StyledToastContainer';

import Navigation from './components/Navigation';
import Home from './components/Home';
import SignUp from './components/SignUp';
import LogIn from './components/LogIn';
import Mint from './components/Mint';

import CloseButton from './components/common/Button/CloseButton';

import GlobalStyle from './styles/GlobalStyle';
import 'react-toastify/dist/ReactToastify.css';

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
          <StyledToastContainer
            position="bottom-right"
            hideProgressBar
            closeOnClick={false}
            transition={Zoom}
            closeButton={<CloseButton className="Toastify__close-button" />}
          />
        </Router>
      </div>
    </>
  );
}
