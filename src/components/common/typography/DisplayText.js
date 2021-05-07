import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { ReactChildrenTypeRequired } from '../../../types/ReactChildrenTypes';

const StyledH1 = styled('h1')`
  text-align: center;
  font-size: ${(props) => (props.isBig ? '100px' : '63px')};
  margin-bottom: 20px;

  @media (max-width: 767px) {
    margin-top: 30px;
    font-size: 70px;
  }
`;

const DisplayText = ({ children, isBig }) => (
  <StyledH1 className="border-text" isBig={isBig}>
    {children}
  </StyledH1>
);

DisplayText.propTypes = {
  children: ReactChildrenTypeRequired,
  isBig: PropTypes.bool,
};

export default DisplayText;
