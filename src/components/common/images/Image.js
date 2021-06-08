import React, { forwardRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import DiamondIcon from '../../../assets/DiamondIcon';

import { beatAnimate } from '../../../styles/mixins';

const StyledContainer = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;

  ${({ isMediaLoaded }) =>
    !isMediaLoaded &&
    `
    min-width: 400px;
    min-height: 400px;
    border-radius: var(--radius-default);
    box-shadow: inset var(--shadow-primary);
    `}
  .image {
    display: ${({ isMediaLoaded }) => (isMediaLoaded ? 'inline' : 'none')};
  }

  .diamond-icon {
    ${({ isMediaLoading }) => (isMediaLoading ? beatAnimate(0.4) : '')}

    height: 50px;
    width: 50px;
    filter: ${({ isMediaLoading }) => (isMediaLoading ? 'drop-shadow(var(--shadow-primary))' : '')};
    opacity: ${({ isMediaLoading }) => (isMediaLoading ? '1' : '0.25')};
    display: ${({ isMediaLoaded }) => (isMediaLoaded ? 'none' : 'inline')};
  }

  @media (min-width: 1100px) {
    ${({ isMediaLoaded }) => !isMediaLoaded && `min-width: 320px; min-height: 320px;`}
  }
`;

const Image = forwardRef(function ImageWithRef({ src, alt, media, ...rest }, ref) {
  const [isMediaLoaded, setIsMediaLoaded] = useState(null);
  const [isMediaLoading, setIsMediaLoading] = useState(false);

  const processMediaLoaded = () => {
    setIsMediaLoaded(true);
    setIsMediaLoading(false);
  };

  const processMediaError = () => {
    setIsMediaLoading(false);
  };

  useEffect(() => {
    if (media || src) {
      setIsMediaLoading(true);
    }

    if (src === null) {
      setIsMediaLoading(false);
    }
  }, [src, media]);

  return (
    <StyledContainer isMediaLoaded={isMediaLoaded} isMediaLoading={isMediaLoading}>
      {src && src.startsWith('data:video') ? (
        <video
          src={src}
          className="image"
          autoPlay
          muted
          loop
          ref={ref}
          onLoadedData={processMediaLoaded}
          onError={processMediaError}
          {...rest}
        />
      ) : (
        <img
          src={src}
          alt={alt}
          className="image"
          ref={ref}
          onLoad={processMediaLoaded}
          onError={processMediaError}
          {...rest}
        />
      )}
      <DiamondIcon />
    </StyledContainer>
  );
});

Image.propTypes = {
  src: PropTypes.string,
  media: PropTypes.string,
  alt: PropTypes.string,
};

Image.defaultPtops = {
  alt: 'media',
};

export default Image;
