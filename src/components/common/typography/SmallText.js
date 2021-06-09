import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styled from 'styled-components';

import { ReactChildrenTypeRequired } from '~/types/ReactChildrenTypes';

const StyledContainer = styled('div')`
  color: ${({ isError }) => (isError ? 'var(--error)' : 'var(--periwinkle)')};
  font-size: 12px;
  line-height: 21px;
`;

const SmallText = ({ children, isError, className }) => (
  <StyledContainer isError={isError} className={classnames('small-text', className)}>
    {children}
  </StyledContainer>
);

SmallText.propTypes = {
  children: ReactChildrenTypeRequired,
  isError: PropTypes.bool,
  className: PropTypes.string,
};

export default SmallText;
