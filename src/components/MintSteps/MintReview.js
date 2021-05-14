import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { HeadingText } from '../common/typography';
import Button from '../common/Button';
import ArtItem from '../common/ArtItem';

const Container = styled('div')`
  max-width: 600px;
  margin: 0 auto;
  width: 100%;

  .button-bottom {
    position: fixed;
    display: flex;
    justify-content: center;
    bottom: 0;
    right: 0;
    left: 0;
    padding: 20px 13px;
    background-color: var(--plum);
    box-shadow: 0 0 74px rgba(190, 20, 205, 0.45);

    button {
      width: 100%;
      max-width: 400px;
    }
  }
`;

const MintReview = ({ imageDataUrl, bid, onCompleteLink }) => {
  return (
    <Container>
      <HeadingText>Yay!</HeadingText>
      <p>This is how your NFT will appear on the marketplace. You cannot remove an NFT once it is minted.</p>
      <ArtItem dataUrl={imageDataUrl} bid={bid} />
      <div className="button-bottom">
        <Button isPrimary isLink>
          <Link to={onCompleteLink}>Mint NFT</Link>
        </Button>
      </div>
    </Container>
  );
};

MintReview.propTypes = {
  imageDataUrl: PropTypes.string,
  bid: PropTypes.string,
  onCompleteLink: PropTypes.string,
};

export default MintReview;
