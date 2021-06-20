import React from 'react';
import styled from 'styled-components';

import { ReactChildrenTypeRequired } from '~/types/ReactChildrenTypes';

const StyledH2 = styled('h2')`
  margin-top: 25px;
  font-family: var(--font-secondary);
  font-size: 66px;
  font-weight: normal;
  text-transform: uppercase;
  color: var(--bubble-gum);

  @media (min-width: 767px) {
  }
`;

const HeadingText = ({ children }) => <StyledH2>{children}</StyledH2>;

HeadingText.propTypes = {
  children: ReactChildrenTypeRequired,
};

export default HeadingText;
