import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styled from 'styled-components';

import { ReactChildrenType } from '../../../types/ReactChildrenTypes';

const StyledButton = styled('button')`
  padding: 16px 20px;
  border: 1px solid var(--lavendar);
  border-radius: var(--radius-default);
  font-family: 'Comfortaa', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell',
    'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  font-size: 16px;
  text-decoration: none;
  cursor: pointer;
  transition: 100ms;

  &.button--primary {
    border-color: var(--lavendar);
    background-color: var(--lavendar);
    color: var(--plum);
  }

  &.button--secondary {
    background-color: var(--plum);
    color: var(--lavendar);
  }

  :hover {
    background-color: var(--pink);
    color: white;
  }

  a {
    text-decoration: none;
    color: inherit;
  }
`;

const Button = ({ children, isPrimary = false, isSecondary = false }) => (
  <StyledButton
    className={classNames('button', {
      'button--primary': isPrimary,
      'button--secondary': isSecondary,
    })}
  >
    {children}
  </StyledButton>
);

Button.propTypes = {
  children: ReactChildrenType,
  isPrimary: PropTypes.bool,
  isSecondary: PropTypes.bool,
};

export default Button;
