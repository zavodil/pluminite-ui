import React, { useContext } from 'react';
import { HashRouter as Router, Switch } from 'react-router-dom';
import { toast, Zoom } from 'react-toastify';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { ErrorBoundary } from 'react-error-boundary';

import { NearContext } from './contexts';

import { GuestPage, Page, UserPage } from './router';

import StyledToastContainer from './styles/StyledToastContainer';

import Navigation from './components/Navigation';
import Footer from './components/Footer';
import ErrorFallback from './components/ErrorFallback';

import {
  Home,
  SignUp,
  LogIn,
  Mint,
  Profile,
  ProfileEdit,
  Gem,
  GemOriginal,
  TransferGem,
  NotFound404,
  MintNotAllowed,
  Faq,
  Terms,
  NotEnoughBalance,
} from './components/pages';

import { CloseButton } from './components/common/buttons';

import GlobalStyle from './styles/GlobalStyle';
import 'react-toastify/dist/ReactToastify.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 5,
      retryDelay: 1000,
      staleTime: 1000 * 60,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  const { user, isLoading } = useContext(NearContext);

  const isAuthenticated = !!user;

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalStyle />
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <div className="app">
          {process.env.NODE_ENV !== 'production' && <ReactQueryDevtools initialIsOpen={true} />}
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
                <Page path="/faq" component={Faq} title="Faqs" />
                <Page path="/terms" component={Terms} title="Terms and Conditions" />
                <Page path="/not-enough-balance" component={NotEnoughBalance} title="Not Enough Balance" />
                <UserPage
                  exact
                  path="/profile"
                  component={Profile}
                  title={user?.accountId || 'Profile'}
                  isAuthenticated={isAuthenticated}
                  isLoading={isLoading}
                />
                <UserPage
                  path="/profile/edit"
                  component={ProfileEdit}
                  title={user?.accountId ? `${user?.accountId} | Edit` : 'Edit Profile'}
                  isAuthenticated={isAuthenticated}
                  isLoading={isLoading}
                />
                <Page path="/gem/:gemId" component={Gem} isAuthenticated={isAuthenticated} isLoading={isLoading} />
                <Page
                  path="/gem-original/:gemId"
                  component={GemOriginal}
                  isAuthenticated={isAuthenticated}
                  isLoading={isLoading}
                />
                <Page
                  path="/transfer-gem/:gemId"
                  component={TransferGem}
                  isAuthenticated={isAuthenticated}
                  isLoading={isLoading}
                />
                <UserPage
                  path="/mint-not-allowed"
                  component={MintNotAllowed}
                  title={'Mint not Allowed'}
                  isAuthenticated={isAuthenticated}
                  isLoading={isLoading}
                />
                <Page component={NotFound404} />
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
      </ErrorBoundary>
    </QueryClientProvider>
  );
}
