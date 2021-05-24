import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import Button from '../Button';

// todo: remove for production
import placeholderDataUrl from '../../../assets/art.png';

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

const ArtItem = forwardRef(function ArtItemWithRef({ gemId, dataUrl, buttonText, isButtonDisabled }, ref) {
  const isLink = !!gemId;
  const params = {
    to: isLink
      ? {
          pathname: `/gem/${gemId}`,
          prevPathname: window.location.pathname,
        }
      : undefined,
    as: isLink ? Link : 'div',
  };

  return (
    <StyledContainer {...params}>
      <div className="image-container">
        <img ref={ref} src={dataUrl || placeholderDataUrl} alt="art" />
      </div>
      <Button isPrimary isSmall isDisabled={isButtonDisabled}>
        {buttonText}
      </Button>
    </StyledContainer>
  );
});

ArtItem.propTypes = {
  gemId: PropTypes.string,
  dataUrl: PropTypes.string,
  buttonText: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isButtonDisabled: PropTypes.bool,
};

export default ArtItem;
