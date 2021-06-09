import React from 'react';
import styled from 'styled-components';

import { ReactChildrenTypeRequired } from '~/types/ReactChildrenTypes';

const StyledH3 = styled('h3')`
  margin: 0;
  font-family: var(--font-secondary);
  font-size: 18px;
  line-height: 24px;
  font-weight: normal;
  text-transform: uppercase;
  color: var(--bubble-gum);
`;

const HeadingSmallText = ({ children }) => <StyledH3 className="heading-small">{children}</StyledH3>;

HeadingSmallText.propTypes = {
  children: ReactChildrenTypeRequired,
};

export default HeadingSmallText;
