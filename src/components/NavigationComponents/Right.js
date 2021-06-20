import React, { useContext } from 'react';
import styled from 'styled-components';
import { Link, useHistory, useRouteMatch } from 'react-router-dom';

import { NearContext } from '~/contexts';

import UserMenu from './UserMenu';
import { Button, CloseButton } from '~/components/common/buttons';
import ProfileUserMenu from './ProfileUserMenu';

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

  .gem-close {
    cursor: pointer;

    > svg {
      stroke: var(--lavendar);
      fill: var(--lavendar);
    }
  }

  :last-child {
    margin-left: auto;
  }

  @media (min-width: 767px) {
    margin: 0;
  }
`;

const Right = () => {
  const isSignUpInPage = !!useRouteMatch('/sign-up') || !!useRouteMatch('/log-in');
  const isProfilePage = useRouteMatch('/profile');
  const isGemPage = useRouteMatch('/gem');
  const isGemOriginalPage = useRouteMatch('/gem-original');
  const isNotEnoughBalancePage = useRouteMatch('/not-enough-balance');

  const { user } = useContext(NearContext);

  const history = useHistory();

  if (isSignUpInPage || isGemPage || isGemOriginalPage) {
    return null;
  }

  let toRender;

  if (isNotEnoughBalancePage) {
    toRender = <CloseButton className="gem-close" processCLick={() => history.push('/')} />;
  } else if (isProfilePage && user) {
    toRender = <ProfileUserMenu />;
  } else if (user) {
    toRender = <UserMenu />;
  } else {
    toRender = (
      <>
        <Button isPrimary>
          <Link to="/sign-up">Sign up</Link>
        </Button>
        <Button isSecondary>
          <Link to="/log-in">Log in with NEAR</Link>
        </Button>
      </>
    );
  }

  return <StyledContainer>{toRender}</StyledContainer>;
};
export default Right;
