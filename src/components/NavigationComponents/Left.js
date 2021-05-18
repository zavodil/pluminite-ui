import React, { useContext } from 'react';
import styled from 'styled-components';
import { Link, useRouteMatch } from 'react-router-dom';

import { NearContext } from '../../contexts';

import placeholderDataUrl from '../../assets/art.png';

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

  const { user } = useContext(NearContext);

  let toRender;

  if (isHomePage) {
    toRender = 'Pluminite';
  } else if (isGemPage) {
    // todo: after nft contract integration replace with actual image
    toRender = <img src={placeholderDataUrl} alt="Art" width={40} height={40} />;
  } else if (isProfilePage && user?.accountId) {
    toRender = user.accountId;
  } else {
    toRender = <Link to="/">Pluminite</Link>;
  }

  return <StyledContainer>{toRender}</StyledContainer>;
};

export default Left;
