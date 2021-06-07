import React, { forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import DiamondIcon from '../../../assets/DiamondIcon';

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
    height: 50px;
    width: 50px;
    filter: drop-shadow(var(--shadow-primary));
    display: ${({ isMediaLoaded }) => (isMediaLoaded ? 'none' : 'inline')};
  }

  @media (min-width: 1100px) {
    ${({ isMediaLoaded }) => !isMediaLoaded && `min-width: 320px; min-height: 320px;`}
  }
`;

const Image = forwardRef(function ImageWithRef({ src, alt, ...rest }, ref) {
  const [isMediaLoaded, setIsMediaLoaded] = useState(null);

  const processMediaLoaded = () => {
    setIsMediaLoaded(true);
  };

  return (
    <StyledContainer isMediaLoaded={isMediaLoaded}>
      {src && src.startsWith('data:video') ? (
        <video src={src} className="image" autoPlay muted loop ref={ref} onLoadedData={processMediaLoaded} {...rest} />
      ) : (
        <img src={src} alt={alt} className="image" ref={ref} onLoad={processMediaLoaded} {...rest} />
      )}
      <DiamondIcon />
    </StyledContainer>
  );
});

Image.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
};

Image.defaultPtops = {
  alt: 'media',
};

export default Image;
