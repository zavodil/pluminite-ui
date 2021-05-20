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
`;

const MintReview = ({ onCompleteLink, nft }) => {
  const showMintSuccessMessage = () => {
    toast.success(<MintSuccessMessage />);
  };

  return (
    <Container>
      <HeadingText>Yay!</HeadingText>
      <p>This is how your NFT will appear on the marketplace. You cannot remove an NFT once it is minted.</p>
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
