import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { toast } from 'react-toastify';

import { HeadingText } from '../common/typography';
import { MintSuccessMessage } from '../common/messages';
import { ArtItemPriced } from '../common/art';
import ButtonBottom from '../common/Button/ButtonBottom';
import { NftTypeRequired } from '../../types/NftTypes';

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

const MintReview = ({ onCompleteLink, nft }) => {
  const showMintSuccessMessage = () => {
    toast.success(<MintSuccessMessage />);
  };

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
      <ArtItemPriced dataUrl={nft.artDataUrl} bid={nft.startingBid} bidAvailable={false} />
      <ButtonBottom link={onCompleteLink} text="Mint NFT" onButtonClick={showMintSuccessMessage} />
    </Container>
  );
};

MintReview.propTypes = {
  onCompleteLink: PropTypes.string,
  nft: NftTypeRequired,
};

export default MintReview;
