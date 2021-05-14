import React, { useContext } from 'react';
import styled from 'styled-components';
import { Link, useRouteMatch } from 'react-router-dom';

import { NearContext } from '../../contexts';

import UserDropdown from './UserDropdown';
import Button from '../common/Button';

const StyledContainer = styled('div')`
  margin-left: 20px;

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
    margin: 0;
  }
`;

const Right = () => {
  const isSignUpInPage = !!useRouteMatch('/sign-up') || !!useRouteMatch('/log-in');

  if (isSignUpInPage) {
    return null;
  }

  const { user } = useContext(NearContext);

  return (
    <StyledContainer>
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
    </StyledContainer>
  );
};

export default Right;
