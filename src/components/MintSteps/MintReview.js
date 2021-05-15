import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { toast } from 'react-toastify';

import { HeadingText } from '../common/typography';
import { MintSuccessMessage } from '../common/messages';
import { ArtItemPriced } from '../common/art';
import ButtonBottom from '../common/Button/ButtonBottom';

const Container = styled('div')`
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
`;

const MintReview = ({ imageDataUrl, bid, onCompleteLink }) => {
  const showMintSuccessMessage = () => {
    toast.success(<MintSuccessMessage />);
  };

  return (
    <Container>
      <HeadingText>Yay!</HeadingText>
      <p>This is how your NFT will appear on the marketplace. You cannot remove an NFT once it is minted.</p>
      <ArtItemPriced dataUrl={imageDataUrl} bid={bid} bidAvailable={false} />
      <ButtonBottom link={onCompleteLink} text="Mint NFT" onButtonClick={showMintSuccessMessage} />
    </Container>
  );
};

MintReview.propTypes = {
  imageDataUrl: PropTypes.string,
  bid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onCompleteLink: PropTypes.string,
};

export default MintReview;
