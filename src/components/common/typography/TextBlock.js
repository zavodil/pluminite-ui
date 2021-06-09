import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { ReactChildrenTypeRequired } from '~/types/ReactChildrenTypes';

const StyledDiv = styled('div')`
  padding: 33px 23px;
  width: 343px;
  background: rgba(var(--lavendar-base), 0.2);
  border: 1px solid var(--periwinkle);
  border-radius: 8px;
  color: var(--bubble-gum);

  .text-block-title {
    margin: 0;
    font-family: var(--font-secondary);
    font-size: 31px;
    font-weight: 400;
    text-transform: uppercase;
  }

  .text-block-text {
    margin: 20px 0 0;
    font-size: 18px;
    line-height: 27px;
  }
`;

const TextBlock = ({ children, isCritical, title }) => (
  <StyledDiv isCritical={isCritical}>
    <h4 className="text-block-title">{title}</h4>
    <p className="text-block-text">{children}</p>
  </StyledDiv>
);

TextBlock.propTypes = {
  title: PropTypes.string,
  children: ReactChildrenTypeRequired,
  isCritical: PropTypes.bool,
};

export default TextBlock;
