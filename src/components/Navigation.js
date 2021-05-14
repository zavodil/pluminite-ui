import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Link, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';

import { NearContext } from '../contexts';

import UserDropdown from './Navigation/UserDropdown';
import Button from './common/Button';

const Container = styled('div')`
  z-index: 1;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 24px;

  .left {
    height: 52px;
    line-height: 52px;
    font-size: 20px;
    font-weight: 300;
    cursor: default;
    user-select: none;

    a {
      color: var(--lavendar);
    }
  }

  .right {
    margin-left: 20px;
  }

  button {
    :first-of-type {
      margin-right: 20px;
    }
  }

  .connect-query {
    margin-right: 40px;
    color: var(--lavendar);
    font-size: 18px;
    text-decoration: none;
  }

  .button-connect {
    padding: 16px 20px;
    border: var(--lavendar) 1px solid;
    background-color: var(--plum);
    color: var(--lavendar);
  }

  @media (min-width: 767px) {
    align-items: center;
    justify-content: space-between;
    flex-direction: row;

    .left {
      font-size: 30px;
    }

    .right {
      margin: 0;
    }
  }
`;

const AccountDisplay = ({ text, handleOnClick, className }) => (
  <span className={`account-display ${className}`} onClick={handleOnClick}>
    Hi, <span className="account-display-id">{text}</span> :)
  </span>
);

AccountDisplay.propTypes = {
  text: PropTypes.string,
  handleOnClick: PropTypes.func,
  className: PropTypes.string,
};

// Use with SignUpSpare if needed
// const SignUpPageNavigation = (signInAction) => (
//   <>
//     <span className="connect-query">Already have a NEAR account?</span>
//     <button className="button button-connect" onClick={signInAction}>
//       Connect Wallet
//     </button>
//   </>
// );

export default function Navigation() {
  const { user } = useContext(NearContext);

  const isHomePage = useRouteMatch('/').isExact;
  const isSignUpInPage = !!useRouteMatch('/sign-up') || !!useRouteMatch('/log-in');

  return (
    <Container>
      <div className="left">
        {isHomePage ? (
          'Pluminite'
        ) : (
          <Link css="color: var(--lavendar)" to="/">
            Pluminite
          </Link>
        )}
      </div>
      {!isSignUpInPage && (
        <div className="right">
          {/* eslint-disable-next-line no-nested-ternary */}
          {user ? (
            <UserDropdown />
          ) : (
            <>
              <Button isPrimary isLink>
                <Link to="/sign-up">Sign up</Link>
              </Button>
              <Button isSecondary isLink>
                <Link to="/log-in">Log in with NEAR</Link>
              </Button>
            </>
          )}
        </div>
      )}
    </Container>
  );
}
