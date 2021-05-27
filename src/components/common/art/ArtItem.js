import React, { forwardRef, useRef } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import Button from '../Button';

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

const ArtItem = forwardRef(function ArtItemWithRef(
  { gemId, dataUrl, buttonText, isButtonDisabled, onButtonClick },
  ref
) {
  const location = useLocation();
  const canvasRef = useRef();

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

  function copyImageOnCanvas(event) {
    const image = event.target;
    const canvas = canvasRef.current;

    // todo: improve checks once storage is implemented and file extensions of art items are known
    if (/(.gif\?)|(.gif$)/.test(event.target.src)) {
      image.classList.remove('hidden');
      canvas.classList.add('hidden');

      return;
    }

    const ctx = canvas.getContext('2d');

    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;

    ctx.drawImage(image, 0, 0);
  }

  return (
    <StyledContainer {...params}>
      <div className="image-container">
        <img ref={ref} src={dataUrl} alt="art" onLoad={copyImageOnCanvas} className="hidden" />
        <canvas ref={canvasRef} />
      </div>
      {buttonText && (
        <Button isPrimary isSmall isDisabled={isButtonDisabled} onClick={onButtonClick}>
          {buttonText}
        </Button>
      )}
    </StyledContainer>
  );
});

ArtItem.propTypes = {
  gemId: PropTypes.string,
  dataUrl: PropTypes.string.isRequired,
  buttonText: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isButtonDisabled: PropTypes.bool,
  onButtonClick: PropTypes.func,
};

ArtItem.defaultProps = {
  onButtonClick: () => {},
};

export default ArtItem;
