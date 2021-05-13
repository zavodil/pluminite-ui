import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';

import MintDescribe from './Mint/MintDescribe';

import bgSignup from '../assets/bg-signup.png';

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 100px 28px 120px;

  .container {
    max-width: 600px;
    margin: 0 auto;
  }

  h2 {
    margin-bottom: 0;
    text-align: center;
  }

  .freebies {
    min-height: 70px;
  }

  .collaborator {
    cursor: pointer;
  }

  .button-bottom {
    position: fixed;
    display: flex;
    justify-content: center;
    bottom: 0;
    right: 0;
    left: 0;
    padding: 20px 13px;
    background-color: var(--plum);
    box-shadow: 0 0 74px rgba(190, 20, 205, 0.45);

    button {
      width: 100%;
      max-width: 400px;
    }
  }

  @media (min-width: 767px) {
    background: url(${bgSignup}) no-repeat bottom left fixed;
  }
`;

export default function Mint() {
  const match = useRouteMatch();

  return (
    <Container>
      <Switch>
        <Route path={match.path}>
          <MintDescribe />
        </Route>
        <Route path={`${match.path}/upload`} />
      </Switch>
    </Container>
  );
}
