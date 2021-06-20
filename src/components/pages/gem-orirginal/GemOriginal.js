import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Redirect, useHistory, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import styled from 'styled-components';

import { getBlacklistedTokens } from '~/apis';

import { MediaFromIpfs } from '~/components/common/media';
import { CloseButton } from '~/components/common/buttons';
import { Portal } from '~/components/common/utils';
import { BottomBid, BottomSell } from '../gem/components';

import { useDocumentTitle } from '~/hooks';

import { NftContractContext, MarketContractContext, NearContext } from '~/contexts';

import { QUERY_KEYS } from '~/constants';

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  min-height: ${({ isBottomSell }) => (isBottomSell ? 'calc(100% - 211px)' : 'calc(100% - 173px)')};
  padding: 192px 28px 60px;

  .image {
    max-width: 100%;
    border-radius: var(--radius-default);
  }

  @media (min-width: 767px) {
    margin: 0 auto;
    align-items: center;
  }
`;

const GemHeader = styled('div')`
  position: absolute;
  top: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  z-index: 2;
  min-height: 92px;

  .gem-close {
    cursor: pointer;

    > svg {
      stroke: var(--lavendar);
      fill: var(--lavendar);
    }
  }
`;

function GemOriginal({ location: { prevPathname } }) {
  const { user } = useContext(NearContext);
  const { getGem } = useContext(NftContractContext);
  const { getSale, marketContract } = useContext(MarketContractContext);
  const { gemId } = useParams();
  const history = useHistory();

  const queryClient = useQueryClient();

  const getCachedNft = (queryKeys) => {
    let cachedNft;
    // eslint-disable-next-line no-restricted-syntax
    for (const queryKey of queryKeys) {
      const cachedNfts = queryClient.getQueryData(queryKey);
      cachedNft = cachedNfts?.pages?.length
        ? cachedNfts.pages.flat().find(({ token_id }) => token_id === gemId)
        : undefined;

      if (cachedNft) {
        break;
      }
    }

    return cachedNft;
  };

  const cachedNft = getCachedNft([QUERY_KEYS.SALES_POPULATED, QUERY_KEYS.GEMS_FOR_OWNER, QUERY_KEYS.GEMS_FOR_CREATOR]);

  const { data: gem } = useQuery([QUERY_KEYS.GEM, gemId], () => getGem(gemId), {
    onError() {
      toast.error('Sorry 😢 There was an error getting the gem. Please, try again later.');
      history.push('/');
    },
    initialData: cachedNft,
  });

  const cachedSaleNft = getCachedNft([QUERY_KEYS.SALES_POPULATED]);

  const { data: gemOnSale } = useQuery(
    [QUERY_KEYS.GEM_ON_SALE, gemId],
    async () => {
      if (Object.keys(gem.approved_account_ids).includes(marketContract.contractId)) {
        return getSale(gemId);
      }

      return null;
    },
    {
      enabled: !!gem,
      onError() {
        toast.error('Sorry 😢 There was an error getting the gem. Please, try again later.');
        history.push('/');
      },
      initialData: cachedSaleNft,
    }
  );

  useDocumentTitle(gem?.metadata?.title || 'Untitled Gem');

  const isListed = () => !!gemOnSale;

  const isOwnedByUser = () => gemOnSale?.owner_id && gemOnSale.owner_id === user?.accountId;

  const { data: blacklistedTokens } = useQuery([QUERY_KEYS.BLACKLIST], () => getBlacklistedTokens(), {
    staleTime: 1000 * 60 * 10,
  });

  const goBack = () => {
    if (prevPathname) {
      history.push(prevPathname);
    } else {
      history.push('/');
    }
  };

  if (gem === null) {
    return <Redirect to="/404" />;
  }
  if (!blacklistedTokens) {
    return null;
  }
  if (gem?.token_id && blacklistedTokens.includes(gem.token_id)) {
    return <Redirect to="/" />;
  }

  let BottomComponent = () => null;
  if (isListed()) {
    BottomComponent = BottomBid;
  } else if (!isListed() && isOwnedByUser()) {
    BottomComponent = BottomSell;
  }

  return (
    <Container isBottomSell={BottomComponent === BottomSell}>
      <Portal>
        <GemHeader>
          <div />
          <CloseButton className="gem-close" processCLick={goBack} />
        </GemHeader>
      </Portal>
      <MediaFromIpfs media={gem?.metadata?.media} alt={gem?.metadata?.title} />
      <BottomComponent gem={gem} gemOnSale={gemOnSale} />
    </Container>
  );
}

GemOriginal.propTypes = {
  location: PropTypes.shape({
    prevPathname: PropTypes.string,
  }),
  dataUrl: PropTypes.string,
  buttonText: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isButtonDisabled: PropTypes.bool,
};

export default GemOriginal;
