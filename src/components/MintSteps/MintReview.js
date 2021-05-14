import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { HeadingText } from '../common/typography';
import ArtItem from '../common/ArtItem';
import ButtonBottom from '../common/Button/ButtonBottom';

const Container = styled('div')`
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
`;

const MintReview = ({ imageDataUrl, bid, onCompleteLink }) => {
  return (
    <Container>
      <HeadingText>Yay!</HeadingText>
      <p>This is how your NFT will appear on the marketplace. You cannot remove an NFT once it is minted.</p>
      <ArtItem dataUrl={imageDataUrl} bid={bid} />
      <ButtonBottom link={onCompleteLink} text="Mint NFT" />
    </Container>
  );
};

MintReview.propTypes = {
  imageDataUrl: PropTypes.string,
  bid: PropTypes.string,
  onCompleteLink: PropTypes.string,
};

export default MintReview;
