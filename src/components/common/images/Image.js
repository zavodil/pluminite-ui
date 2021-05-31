import React, { forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import DiamondIcon from '../../../assets/DiamondIcon';

const StyledContainer = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;

  ${({ isImgLoaded }) =>
    !isImgLoaded &&
    `
    min-width: 400px;
    min-height: 400px;
    border-radius: var(--radius-default);
    box-shadow: inset var(--shadow-primary);
    `}
  .image {
    display: ${({ isImgLoaded }) => (isImgLoaded ? 'inline' : 'none')};
  }

  > svg {
    height: 50px;
    width: 50px;
    filter: drop-shadow(var(--shadow-primary));
    display: ${({ isImgLoaded }) => (isImgLoaded ? 'none' : 'inline')};
  }

  @media (min-width: 1100px) {
    ${({ isImgLoaded }) => !isImgLoaded && `min-width: 320px; min-height: 320px;`}
  }
`;

const Image = forwardRef(function ImageWithRef({ src, alt, ...rest }, ref) {
  const [isImgLoaded, setIsImgLoaded] = useState(null);

  const processImgLoaded = () => {
    setIsImgLoaded(true);
  };

  return (
    <StyledContainer isImgLoaded={isImgLoaded}>
      <img ref={ref} src={src} alt={alt} onLoad={processImgLoaded} className="image" {...rest} />
      <DiamondIcon />
    </StyledContainer>
  );
});

Image.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
};

Image.defaultPtops = {
  alt: 'image',
};

export default Image;
