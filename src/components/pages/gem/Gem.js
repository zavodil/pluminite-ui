import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Redirect, useHistory, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { formatNearAmount } from 'near-api-js/lib/utils/format';

import { getBlacklistedTokens, getFileData } from '../../../apis';

import { BottomSell, BottomBid } from './components';
import { ArtItem } from '../../common/art';
import CloseButton from '../../common/Button/CloseButton';
import { TitleText } from '../../common/typography';
import { Tabs } from '../../common/tabs';
import { Portal } from '../../common/utils';

import { useDocumentTitle } from '../../../hooks';

import { NftContractContext, MarketContractContext, NearContext } from '../../../contexts';

import { QUERY_KEYS } from '../../../constants';

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  min-height: ${({ isBottomSell }) => (isBottomSell ? 'calc(100% - 211px)' : 'calc(100% - 173px)')};
  max-width: 767px;
  padding: 192px 28px 60px;

  .gem-title {
    margin-bottom: 5px;
  }

  .users {
    color: rgba(var(--lavendar-base), 0.7);
    margin-bottom: 40px;

    p {
      margin: 0 0 5px;

      :last-of-type {
        margin-bottom: 0;
      }
    }
  }

  .tabs-titles {
    margin-bottom: 40px;
  }

  .art-item {
    margin: 0 auto;
  }

  .history-event {
    padding: 20px 0;
    font-size: 16px;
    line-height: 24px;

    :first-of-type {
      padding-top: 0;
    }

    :not(:last-of-type) {
      //border-bottom: 1px solid var(--bubble-gum);
      border-bottom: 1px solid rgba(var(--bubble-gum-base), 0.2);
    }
  }

  .royalty {
    text-align: right;
    margin-bottom: 25px;

    &-user {
      margin-right: 25px;
    }

    &-royalty {
      font-size: 34px;
      font-family: var(--font-secondary);
      color: rgba(var(--bubble-gum-base), 0.7);
    }
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

function Gem({ location: { prevPathname } }) {
  const { user } = useContext(NearContext);
  const { getGem } = useContext(NftContractContext);
  const { getSale, marketContract } = useContext(MarketContractContext);

  const { gemId } = useParams();

  const history = useHistory();

  const { data: gem } = useQuery([QUERY_KEYS.GEM, gemId], () => getGem(gemId), {
    onError() {
      toast.error('Sorry 😢 There was an error getting the gem. Please, try again later.');
      history.push('/');
    },
  });

  useDocumentTitle(gem?.metadata?.title || 'Untitled Gem');

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
    }
  );

  const getIpfsHashMedia = () => {
    let mediaLowRes;

    if (gem?.metadata?.extra) {
      mediaLowRes = JSON.parse(gem.metadata.extra).media_lowres;
    }

    return mediaLowRes || gem?.metadata?.media;
  };

  const { data: imageData } = useQuery(
    [QUERY_KEYS.GET_IMAGE_DATA, getIpfsHashMedia()],
    () => getFileData(getIpfsHashMedia()),
    {
      retry: 1,
      enabled: !!gem && !!getIpfsHashMedia(),
    }
  );

  const { data: blacklistedTokens } = useQuery([QUERY_KEYS.BLACKLIST], () => getBlacklistedTokens(), {
    staleTime: 1000 * 60 * 10,
  });

  const hasBids = () => !!gemOnSale?.bids?.near?.owner_id;

  const isListed = () => !!gemOnSale;

  const isOwnedByUser = () => gem?.owner_id && gem.owner_id === user?.accountId;

  const goBack = () => {
    if (prevPathname) {
      history.push(prevPathname);
    } else {
      history.push('/');
    }
  };

  const getCreator = () => {
    if (!gem?.metadata?.extra) {
      return undefined;
    }

    return JSON.parse(gem?.metadata?.extra).creator_id;
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
          <div>{imageData && <img src={imageData} alt={gem?.metadata?.title} width={40} height={40} />}</div>
          <CloseButton className="gem-close" processCLick={goBack} />
        </GemHeader>
      </Portal>
      <TitleText className="gem-title">{gem?.metadata?.title || 'No title provided'}</TitleText>
      <div className="users">
        <p>by {getCreator() || '?'}</p>
        <p>owned by {gem?.owner_id || '?'}</p>
      </div>
      <Tabs
        tabsArray={[
          {
            title: 'Preview',
            content: <ArtItem nft={gem} isFullScreenEnabled isFromIpfs />,
          },
          {
            title: 'Description',
            content: gem?.metadata?.description || 'No description provided',
          },
          {
            title: 'History',
            content: (
              // todo: gemOnSale.bids.near.date is currently not implemented on the contracts
              <>
                {hasBids() && (
                  <div className="history-event">
                    {gemOnSale.bids.near.owner_id} bid {formatNearAmount(gemOnSale.bids.near.price)}Ⓝ on{' '}
                    {gemOnSale.bids.near.date
                      ? new Intl.DateTimeFormat().format(new Date(gemOnSale.bids.near.date))
                      : 'unknown date'}
                  </div>
                )}
                {gem?.metadata?.issued_at && (
                  <div className="history-event">
                    {getCreator() || '?'} minted {gem?.metadata?.title || 'untitled gem'} on{' '}
                    {new Intl.DateTimeFormat().format(new Date(+gem.metadata.issued_at))}
                  </div>
                )}
              </>
            ),
          },
          {
            title: 'Royalties',
            content:
              gem?.royalty &&
              Object.entries(gem.royalty).map(([userId, royalty], index) => (
                <div key={`royalty-${index}`} className="royalty">
                  <span className="royalty-user">{userId}</span>
                  <span className="royalty-royalty">{royalty / 100}%</span>
                </div>
              )),
          },
        ]}
      />
      <BottomComponent gem={gem} gemOnSale={gemOnSale} />
    </Container>
  );
}

Gem.propTypes = {
  location: PropTypes.shape({
    prevPathname: PropTypes.string,
  }),
  dataUrl: PropTypes.string,
  buttonText: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isButtonDisabled: PropTypes.bool,
};

export default Gem;
