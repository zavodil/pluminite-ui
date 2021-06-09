import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { ReactChildrenTypeRequired } from '~/types/ReactChildrenTypes';

const StyledContainer = styled('div')`
  position: relative;
  width: fit-content;

  .display-text {
    font-family: var(--font-secondary);
    font-size: ${(props) => (props.isBig ? '100px' : '63px')};
    font-weight: 700;
    text-transform: uppercase;
    color: var(--background);
    letter-spacing: 4px;
    line-height: ${(props) => (props.isBig ? '105px' : 'normal')};
    margin: 0;
  }

  .display-text-shadow-1 {
    text-shadow: -1px 0 var(--pink), 0 1px var(--pink), 1px 0 var(--pink), 0 -1px var(--pink);
  }

  .display-text-shadow-2 {
    position: absolute;
    top: 0;
    left: 0;
    text-shadow: 0 0 14px rgba(186, 13, 215, 0.31);
  }

  @media (min-width: 767px) {
    margin: 0 auto 20px;

    .display-text {
      font-size: ${(props) => (props.isBig ? '165px' : '63px')};
      letter-spacing: 13px;
      line-height: normal;
    }
  }
`;

const DisplayText = ({ children, isBig }) => (
  <StyledContainer isBig={isBig}>
    <h1 className={'display-text display-text-shadow-1'}>{children}</h1>
    <div className={'display-text display-text-shadow-2'}>{children}</div>
  </StyledContainer>
);

DisplayText.propTypes = {
  children: ReactChildrenTypeRequired,
  isBig: PropTypes.bool,
};

export default DisplayText;
