import React, { useContext } from 'react';
import styled from 'styled-components';
import { Link, useRouteMatch } from 'react-router-dom';

import { NearContext } from '../../contexts';

import { APP } from '../../constants';

const StyledContainer = styled('div')`
  height: 52px;
  line-height: 52px;
  font-size: 20px;
  font-weight: 300;
  cursor: default;
  user-select: none;

  a {
    color: var(--lavendar);
  }

  @media (min-width: 767px) {
    font-size: 30px;
  }
`;

const Left = () => {
  const isHomePage = useRouteMatch('/')?.isExact;
  const isProfilePage = useRouteMatch('/profile')?.isExact;
  const isGemPage = useRouteMatch('/gem');
  const isGemOriginalPage = useRouteMatch('/gem-original');

  const { user } = useContext(NearContext);

  if (isGemPage || isGemOriginalPage) {
    return null;
  }

  let toRender;

  if (isHomePage) {
    toRender = APP.NAME;
  } else if (isProfilePage && user?.accountId) {
    toRender = user.accountId;
  } else {
    toRender = <Link to="/">{APP.NAME}</Link>;
  }

  return <StyledContainer>{toRender}</StyledContainer>;
};

export default Left;
