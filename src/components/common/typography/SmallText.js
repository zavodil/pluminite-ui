import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { ReactChildrenTypeRequired } from '../../../types/ReactChildrenTypes';

const StyledContainer = styled('div')`
  color: ${({ isError }) => (isError ? 'var(--error)' : 'var(--periwinkle)')};
  font-size: 12px;
  line-height: 21px;
`;

const SmallText = ({ children, isError }) => (
  <StyledContainer isError={isError} className="small-text">
    {children}
  </StyledContainer>
);

SmallText.propTypes = {
  children: ReactChildrenTypeRequired,
  isError: PropTypes.bool,
};

export default SmallText;
