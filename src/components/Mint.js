import React, { useState } from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';

import { MintDescribe, MintUpload, MintReview } from './MintSteps';

import bgSignup from '../assets/bg-signup.png';

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 100px 28px 120px;

  @media (min-width: 767px) {
    background: url(${bgSignup}) no-repeat bottom left fixed;
  }
`;

export default function Mint() {
  const match = useRouteMatch();
  const [imageDataUrl, setImageDataUrl] = useState(null);

  return (
    <Container>
      <Switch>
        <Route path={`${match.path}/upload`}>
          <MintUpload onUpload={setImageDataUrl} onCompleteLink={`${match.path}/review`} />
        </Route>
        <Route path={`${match.path}/review`}>
          <MintReview imageDataUrl={imageDataUrl} onCompleteLink="/profile" />
        </Route>
        <Route path={match.path}>
          <MintDescribe onCompleteLink={`${match.path}/upload`} />
        </Route>
      </Switch>
    </Container>
  );
}
