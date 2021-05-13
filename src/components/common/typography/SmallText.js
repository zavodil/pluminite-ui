import React from 'react';
import styled from 'styled-components';

import { ReactChildrenTypeRequired } from '../../../types/ReactChildrenTypes';

const StyledContainer = styled('div')`
  color: var(--periwinkle);
  font-size: 12px;
  line-height: 21px;
`;

const SmallText = ({ children }) => <StyledContainer className="small-text">{children}</StyledContainer>;

SmallText.propTypes = {
  children: ReactChildrenTypeRequired,
};

export default SmallText;
