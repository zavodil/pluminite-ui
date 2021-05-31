import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import Button from '../Button';
import { ImageFromIpfs } from '../images';

import { square } from '../../../styles/mixins';

const StyledContainer = styled(Link)`
  display: block;
  position: relative;
  width: 400px;
  margin: 15px 5px;
  border-radius: var(--radius-default);
  transition: 250ms;

  :hover {
    transform: scale(1.01);
  }

  .image-container {
    ${square};

    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: var(--radius-default);
    box-shadow: inset var(--shadow-primary);

    .hidden {
      display: none;
    }
  }

  button {
    position: absolute;
    right: 20px;
    bottom: 20px;
  }

  @media (min-width: 1100px) {
    width: 320px;
  }
`;

const ArtItem = ({ gemId, dataUrl, buttonText, isButtonDisabled, onButtonClick, forwardedRef }) => {
  const location = useLocation();

  const isLink = !!gemId;
  const params = {
    to: isLink
      ? {
          pathname: `/gem/${gemId}`,
          prevPathname: location.pathname,
        }
      : undefined,
    as: isLink ? Link : 'div',
  };

  return (
    <StyledContainer {...params}>
      <div className="image-container">
        <ImageFromIpfs media={dataUrl} forwardedRef={forwardedRef} />
      </div>
      {buttonText && (
        <Button isPrimary isSmall isDisabled={isButtonDisabled} onClick={onButtonClick}>
          {buttonText}
        </Button>
      )}
    </StyledContainer>
  );
};

ArtItem.propTypes = {
  gemId: PropTypes.string,
  dataUrl: PropTypes.string.isRequired,
  buttonText: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isButtonDisabled: PropTypes.bool,
  onButtonClick: PropTypes.func,
  forwardedRef: PropTypes.object,
};

ArtItem.defaultProps = {
  onButtonClick: () => {},
};

export default ArtItem;
