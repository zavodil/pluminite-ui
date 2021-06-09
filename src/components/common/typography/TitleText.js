import React from 'react';
import styled from 'styled-components';

import { ReactChildrenTypeRequired } from '~/types/ReactChildrenTypes';

const StyledH3 = styled('h3')`
  margin: 0;
  font-family: var(--font-primary);
  font-size: 40px;
  line-height: 45px;
  font-weight: normal;
  color: var(--lavendar);
  word-break: break-word;
`;

const TitleText = ({ children, ...props }) => <StyledH3 {...props}>{children}</StyledH3>;

TitleText.propTypes = {
  children: ReactChildrenTypeRequired,
};

export default TitleText;
