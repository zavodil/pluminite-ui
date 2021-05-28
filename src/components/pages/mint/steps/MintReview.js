import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { useQueryClient } from 'react-query';
import { Link, Redirect } from 'react-router-dom';
import styled from 'styled-components';
import pinataSDK from '@pinata/sdk';

import { MarketContractContext, NearContext } from '../../../../contexts';

import { getNextBidNearsFormatted } from '../../../../utils/nears';

import { HeadingText } from '../../../common/typography';
import { ArtItemPriced } from '../../../common/art';
import { StickedToBottom } from '../../../common/layout';
import Button from '../../../common/Button';
import { DotsLoading } from '../../../common/utils';

import { QUERY_KEYS, APP } from '../../../../constants';

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
  }

  .sub-header {
    color: var(--periwinkle);
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
  const queryClient = useQueryClient();

  const uploadToIPFS = async (imageDataUrl) => {
    const pinata = pinataSDK(APP.PINATA_API_KEY, APP.PINATA_API_SECRET);
    const metadata = {};
    const data = {
      file: imageDataUrl,
    };

    let result;

    try {
      result = await pinata.pinJSONToIPFS(data, metadata);
    } catch (err) {
      console.error(err);

      return undefined;
    }

    return result.IpfsHash;
  };

  const processMintClick = async () => {
    setIsMinting(true);

    await queryClient.invalidateQueries(QUERY_KEYS.GEMS_FOR_OWNER, user.accountId);
    const ipfsHash = await uploadToIPFS(nft.artDataUrl);
    await mintAndListGem({ ...nft, media: ipfsHash });

    // todo: show MintSuccessMessage on mint success (check if success from query params after on redirect from near
    // wallet when we stop using hash browser) toast.success(<MintSuccessMessage />);

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
      <ArtItemPriced dataUrl={nft.artDataUrl} bid={getNextBidNearsFormatted(nft)} bidAvailable={false} />
      <StickedToBottom isSecondary>
        <StyledButton isSecondary isDisabled={isMinting}>
          <Link to={backLink}>Replace Art</Link>
        </StyledButton>
        <StyledButton onClick={processMintClick} isPrimary isDisabled={isMinting}>
          {isMinting ? 'Minting' : 'Mint NFT'}
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
