import { formatNearAmount } from 'near-api-js/lib/utils/format';
import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useQueryClient } from 'react-query';
import { Link, Redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';

import { MarketContractContext, NearContext, NftContractContext } from '../../../../contexts';

import { HeadingText } from '../../../common/typography';
import { ArtItemPriced } from '../../../common/art';
import { StickedToBottom } from '../../../common/layout';
import { Button } from '../../../common/buttons';
import { DotsLoading } from '../../../common/utils';

import { uploadFile } from '../../../../apis';

import { APP, QUERY_KEYS } from '../../../../constants';

import { NftTypeRequired } from '../../../../types/NftTypes';

const Container = styled('div')`
  max-width: 600px;
  margin: 0 auto;
  width: 100%;

  h2 {
    margin-bottom: 0;
  }

  .clarification {
    margin-bottom: 40px;
    line-height: 24px;
  }

  .text {
    margin-bottom: 25px;
    line-height: 24px;
    word-break: break-word;
  }

  .sub-header {
    color: var(--periwinkle);
  }

  .fee-description {
    margin-top: 50px;
    font-size: 13px;
    line-height: 18px;
  }

  a {
    width: 100%;
  }
`;

const StyledButton = styled(Button)`
  width: 50%;

  :first-of-type {
    margin-right: 10px;
  }
`;

const MintReview = ({ backLink, nft }) => {
  const [isMinting, setIsMinting] = useState(false);
  const { user } = useContext(NearContext);
  const { mintAndListGem } = useContext(MarketContractContext);
  const { getIsFreeMintAvailable } = useContext(NftContractContext);
  const queryClient = useQueryClient();

  const { data: isFreeMintAvailable } = useQuery(
    [QUERY_KEYS.IS_FREE_MINT_AVAILABLE, user.accountId],
    () => getIsFreeMintAvailable(user.accountId),
    {
      enabled: !!user?.accountId,
      staleTime: 0,
    }
  );

  const uploadToIPFS = async ({ file, thumbnailFile }) => Promise.all([uploadFile(file), uploadFile(thumbnailFile)]);

  const processMintClick = async () => {
    setIsMinting(true);

    await Promise.all([
      queryClient.invalidateQueries(QUERY_KEYS.GEMS_FOR_OWNER, user.accountId),
      queryClient.invalidateQueries(QUERY_KEYS.GEMS_FOR_CREATOR, user.accountId),
      queryClient.invalidateQueries(QUERY_KEYS.SALES_POPULATED),
    ]);

    let fileIpfsHash;
    let thumbnailIpfsHash;
    let uploadError;

    try {
      [fileIpfsHash, thumbnailIpfsHash] = await uploadToIPFS({
        file: nft.file,
        thumbnailFile: nft.thumbnailFile,
      });
    } catch (e) {
      console.error(e);
      uploadError = e;
    }

    if (!fileIpfsHash || !thumbnailIpfsHash || uploadError) {
      setIsMinting(false);
      toast.error('Sorry 😢 There was a problem with uploading your art file to IPFS. Try again later.');

      return;
    }

    try {
      await mintAndListGem({ ...nft, media: fileIpfsHash, media_lowres: thumbnailIpfsHash });
    } catch (e) {
      console.error(e);

      setIsMinting(false);
      toast.error('Sorry 😢 There was a problem with minting and listing your gem on the market. Try again later.');

      return;
    }

    setIsMinting(false);
  };

  const wasDescribed = !!nft.creator;

  if (!wasDescribed) {
    return <Redirect to="/" />;
  }

  return (
    <Container>
      <HeadingText>Yay!</HeadingText>
      <p className="clarification">
        This is how your NFT will appear on the marketplace. You cannot remove an NFT once it is minted.
      </p>
      <p className="sub-header">Art piece title</p>
      <p className="text">{nft.title}</p>
      <p className="sub-header">Art piece description</p>
      <p className="text">{nft.description}</p>
      <ArtItemPriced
        nft={{
          ...nft,
          metadata: {
            media:
              (nft.thumbnailFile && URL.createObjectURL(nft.thumbnailFile)) ||
              (nft.file && URL.createObjectURL(nft.file)),
          },
        }}
        bidAvailable={false}
      />
      {!isFreeMintAvailable && (
        <p className="fee-description">
          We will ask to attach {formatNearAmount(APP.DEPOSIT_DEFAULT)} NEAR to mint transaction to cover storage fees.
          All unused funds will be returned to your account in the same transaction.
        </p>
      )}
      <StickedToBottom isSecondary>
        <StyledButton isSecondary isDisabled={isMinting}>
          <Link to={backLink}>Replace Art</Link>
        </StyledButton>
        <StyledButton onClick={processMintClick} isPrimary isDisabled={isMinting}>
          {isMinting ? 'Uploading file to IPFS' : 'Mint NFT'}
          {isMinting && <DotsLoading />}
        </StyledButton>
      </StickedToBottom>
    </Container>
  );
};

MintReview.propTypes = {
  backLink: PropTypes.string.isRequired,
  nft: NftTypeRequired,
};

export default MintReview;
