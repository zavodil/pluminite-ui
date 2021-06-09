import React, { useContext, useEffect, useState } from 'react';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import Big from 'big.js';

import { MarketContractContext } from '~/contexts';

import { Page } from '~/router';
import { MintDescribe, MintUpload, MintReview } from './steps';

import NotFound404 from '~/components/pages/not-found-404';

import { APP } from '~/constants';

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  min-height: calc(100% - 90px);
  padding: 100px 28px 60px;
`;

export default function Mint() {
  const match = useRouteMatch();
  const [nft, setNft] = useState({ conditions: { near: '1000000000000000000000000' } }); // it's in yoctoNears,  === 1Ⓝ
  const [isMintAllowed, setIsMintAllowed] = useState(null);
  const { getStoragePaid, getSalesSupplyForOwner, marketContract, minStorage } = useContext(MarketContractContext);

  const setNftField = (field, value) => {
    setNft((nftOld) => ({ ...nftOld, [field]: value }));
  };

  useEffect(() => {
    if (!APP.USE_STORAGE_FEES) {
      setIsMintAllowed(true);

      return;
    }

    (async () => {
      if (minStorage) {
        let storagePaid;
        let salesNumber;

        try {
          [storagePaid, salesNumber] = await Promise.all([
            getStoragePaid(marketContract.account.accountId),
            getSalesSupplyForOwner(marketContract.account.accountId),
          ]);
        } catch (e) {
          console.error(e);
          toast.error('Sorry 😢 There was an error getting your data. Please, try again later.');

          setIsMintAllowed(false);
          return;
        }

        if (new Big(storagePaid).lte(new Big(minStorage).times(salesNumber))) {
          setIsMintAllowed(false);
        } else {
          setIsMintAllowed(true);
        }
      }
    })();
  }, [minStorage]);

  if (isMintAllowed === false) {
    return (
      <Redirect
        to={{
          pathname: '/mint-not-allowed',
          state: { isMintAllowed },
        }}
      />
    );
  }

  if (isMintAllowed === null) {
    return null;
  }

  return (
    <Container>
      <Switch>
        <Route path={`${match.path}/upload`}>
          <MintUpload
            onUpload={({ file, thumbnailFile }) => {
              setNftField('file', file);
              setNftField('thumbnailFile', thumbnailFile);
            }}
            onCompleteLink={`${match.path}/review`}
            nft={nft}
          />
        </Route>
        <Route path={`${match.path}/review`}>
          <MintReview nft={nft} backLink={`${match.path}/upload`} />
        </Route>
        <Route exact path={match.path}>
          <MintDescribe onCompleteLink={`${match.path}/upload`} nft={nft} setNft={setNft} setNftField={setNftField} />
        </Route>
        <Page component={NotFound404} />
      </Switch>
    </Container>
  );
}
