import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Button from './Button';

// todo: remove for production
import placeholderDataUrl from '../../assets/art.png';

// todo: remove for production
const placeholderBid = 55;

const StyledContainer = styled('div')`
  position: relative;
  width: fit-content;
  margin: 15px 5px;
  transition: 250ms;

  :hover {
    transform: scale(1.01);
  }

  img {
    border-radius: 8px;
    max-width: 100%;

    @media (min-width: 1100px) {
      max-width: 320px;
    }
  }

  button {
    position: absolute;
    right: 20px;
    bottom: 20px;
  }
`;

const ArtItem = ({ dataUrl, bid, bidAvailable }) => (
  <StyledContainer>
    <img src={dataUrl || placeholderDataUrl} alt="art" />
    <Button isPrimary isSmall isDisabled={!bidAvailable}>
      Bid {bid}Ⓝ
    </Button>
  </StyledContainer>
);

ArtItem.propTypes = {
  dataUrl: PropTypes.string,
  bid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  bidAvailable: PropTypes.bool,
};

ArtItem.defaultProps = {
  // todo: remove for production
  dataUrl: placeholderDataUrl,
  // todo: remove for production
  bid: placeholderBid,
  bidAvailable: true,
};

export default ArtItem;
