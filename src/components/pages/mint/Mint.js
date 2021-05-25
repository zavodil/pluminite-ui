import React, { useState } from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';

import { MintDescribe, MintUpload, MintReview } from './steps';

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  min-height: calc(100% - 90px);
  padding: 100px 28px 60px;
`;

export default function Mint() {
  const match = useRouteMatch();
  const [nft, setNft] = useState({ conditions: {} });

  const setNftField = (field, value) => {
    setNft((nftOld) => ({ ...nftOld, [field]: value }));
  };

  return (
    <Container>
      <Switch>
        <Route path={`${match.path}/upload`}>
          <MintUpload
            onUpload={(imageDataUrl) => setNftField('artDataUrl', imageDataUrl)}
            onCompleteLink={`${match.path}/review`}
            nft={nft}
          />
        </Route>
        <Route path={`${match.path}/review`}>
          <MintReview nft={nft} backLink={`${match.path}/upload`} />
        </Route>
        <Route path={match.path}>
          <MintDescribe onCompleteLink={`${match.path}/upload`} nft={nft} setNft={setNft} setNftField={setNftField} />
        </Route>
      </Switch>
    </Container>
  );
}
