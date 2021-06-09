import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styled from 'styled-components';

import { Portal } from '../utils';
import { ReactChildrenType } from '~/types/ReactChildrenTypes';

const StyledContainer = styled('div')`
  display: flex;
  justify-content: center;
  padding: 20px 13px;

  &.primary {
    background-color: var(--plum);
    box-shadow: 0 -36px 36px rgba(190, 20, 205, 0.22);
  }

  &.secondary {
    background-color: var(--plum-light);
  }
`;

const StickedToBottom = ({ children, isPrimary, isSecondary }) => {
  return (
    <Portal mountClassName="sticked-to-bottom">
      <StyledContainer
        className={classNames({
          primary: isPrimary,
          secondary: isSecondary,
        })}
      >
        {children}
      </StyledContainer>
    </Portal>
  );
};

StickedToBottom.propTypes = {
  children: ReactChildrenType,
  isPrimary: PropTypes.bool,
  isSecondary: PropTypes.bool,
};

export default StickedToBottom;
