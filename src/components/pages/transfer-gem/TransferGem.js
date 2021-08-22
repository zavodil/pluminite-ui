import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Redirect, useHistory, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import styled from 'styled-components';

import { getBlacklistedTokens } from '~/apis';

import { ArtItem } from '~/components/common/art';
import { CloseButton, Button } from '~/components/common/buttons';
import { TitleText } from '~/components/common/typography';

import { InputSign } from '~/components/common/forms';

import { Portal } from '~/components/common/utils';
import { BottomBid, BottomSell } from '../gem/components';

import { useDocumentTitle, useDebounce } from '~/hooks';

import { NftContractContext, MarketContractContext, NearContext } from '~/contexts';

import { doesAccountExist } from '~/apis';


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

const NearAccount = ({nearAccountId, onNearAccountIdChange, connection}) => {
  const [userIdValue, setUserIdValue] = useState(nearAccountId);
  const [userIdIsError, setUserIdIsError] = useState(false);
  const debouncedUserIdValue = useDebounce(userIdValue, 500);

  useEffect(() => {
    if (debouncedUserIdValue) {
      doesAccountExist(debouncedUserIdValue, connection).then((doesExist) => {
        setUserIdIsError(!doesExist);
        onNearAccountIdChange({ userId: debouncedUserIdValue, isError: !doesExist});
      });
    } else {
      setUserIdIsError(false);
      onNearAccountIdChange({ userId: debouncedUserIdValue});
    }
   
  }, [debouncedUserIdValue]);

  return (
    <div style={{paddingBottom: "30px"}}>
        <InputSign
          style={{width: "200px", marginBottom: "10px"}}
          marginbottom="0px"
          className="near-account-id"
          type="text"
          autoCapitalize="off"
          sign="@"
          placement="left"
          name={`near-account-id`}
          isSmall
          isError={userIdIsError}
          onChange={(e) => setUserIdValue(e.target.value.toLowerCase())}
          value={userIdValue || ''}
      />
      {userIdIsError ? <div>Unknown Recepient</div> : <></>}
    </div>
  )
}

function TransferGem({ location: { prevPathname } }) {
  const { user, nearContent } = useContext(NearContext);
  const { getGem, nftTransfer } = useContext(NftContractContext);
  const { getSale, marketContract } = useContext(MarketContractContext);
  const { gemId } = useParams();
  const [ nearAccountId, setNearAccountId ] = useState("");
  const [ isDisabled, setIsDisabled ] = useState(true);
  const history = useHistory();

  const queryClient = useQueryClient();

  const updateNearAccount = (props) => {
    console.log(props)
    setNearAccountId(props.userId);
    if(props.isError !== undefined){
      setIsDisabled(props.isError);
    }
  }

  const onTransferClick = async () => {
      if (isDisabled) {
        return;
      }
  
      await queryClient.invalidateQueries(QUERY_KEYS.SALES_POPULATED);
  
      try {
        await nftTransfer(gem.token_id, nearAccountId);
        toast.success('Success! Token was transfered');
      } catch (error) {
        console.error(error);
        toast.error('Sorry 😢 There was an error with nft transfer. Please, check error log and try again later.');
      }
  }


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

  if(gem?.owner_id && gem?.owner_id !== user?.accountId)
    history.push(`/gem/${gem.token_id}`);

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

  console.log(nearAccountId)

  return (
    <Container isBottomSell={BottomComponent === BottomSell}>
      <Portal>
        <GemHeader>
          <div />
          <CloseButton className="gem-close" processCLick={goBack} />
        </GemHeader>
      </Portal>
      <TitleText className="gem-title">Transfer token </TitleText>
    
      <div style={{textAlign: "left", paddingTop: "20px"}}>
        <div>
          Title: {gem?.metadata?.title ? gem?.metadata?.title : 'Untitled'}
        </div>
        <div>
        Recepient:
        </div>
      
        <div>
          <NearAccount
            nearAccountId = {nearAccountId}
            onNearAccountIdChange = {updateNearAccount}
            connection = {nearContent.connection}
          />
        </div>
      </div>

      

      <Button style={{marginBottom: "50px"}}  className="sell-button" isPrimary onClick={onTransferClick} isDisabled={isDisabled}>
          Transfer Gem
      </Button>

      <ArtItem nft={gem} isFullScreenEnabled isFromIpfs />
    </Container>
  );
}

TransferGem.propTypes = {
  location: PropTypes.shape({
    prevPathname: PropTypes.string,
  }),
  dataUrl: PropTypes.string,
  buttonText: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isButtonDisabled: PropTypes.bool,
};

export default TransferGem;
