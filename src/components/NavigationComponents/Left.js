import React, { useContext } from 'react';
import styled from 'styled-components';
import { Link, useRouteMatch } from 'react-router-dom';

import { NearContext } from '../../contexts';

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
  const isHomePage = useRouteMatch('/').isExact;
  const isProfilePage = useRouteMatch('/profile');
  const { user } = useContext(NearContext);

  let toRender;

  if (isHomePage) {
    toRender = 'Pluminite';
  } else if (isProfilePage && user?.accountId) {
    toRender = user.accountId;
  } else {
    toRender = <Link to="/">Pluminite</Link>;
  }

  return <StyledContainer>{toRender}</StyledContainer>;
};

export default Left;
