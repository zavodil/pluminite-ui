import React, { useContext } from 'react';
import { HashRouter as Router, Switch } from 'react-router-dom';
import { toast, Zoom } from 'react-toastify';

import { NearContext } from './contexts';

import { GuestPage, Page, UserPage } from './router';

import StyledToastContainer from './StyledToastContainer';

import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './components/Home';
import SignUp from './components/SignUp';
import LogIn from './components/LogIn';
import Mint from './components/Mint';
import Profile from './components/Profile';
import ProfileEdit from './components/ProfileEdit';
import Gem from './components/Gem';

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
              <UserPage
                exact
                path="/profile"
                component={Profile}
                title={user?.accountId || 'Profile'}
                isAuthenticated={isAuthenticated}
                isLoading={isLoading}
              />
              <UserPage
                exact
                path="/profile/edit"
                component={ProfileEdit}
                title={user?.accountId ? `${user?.accountId} | Edit` : 'Edit Profile'}
                isAuthenticated={isAuthenticated}
                isLoading={isLoading}
              />
              <UserPage
                path="/gem/:gemId"
                component={Gem}
                title={user?.accountId ? `${user?.accountId} | Edit` : 'Edit Profile'}
                isAuthenticated={isAuthenticated}
                isLoading={isLoading}
              />
            </Switch>
            <div className="sticked-to-bottom" />
          </div>
          <Footer />
          <StyledToastContainer
            position={toast.POSITION.BOTTOM_RIGHT}
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
