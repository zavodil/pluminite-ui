import React from 'react';
import styled from 'styled-components';
import { Link, useRouteMatch } from 'react-router-dom';

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

  return <StyledContainer>{isHomePage ? 'Pluminite' : <Link to="/">Pluminite</Link>}</StyledContainer>;
};

export default Left;
