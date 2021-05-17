import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import styled from 'styled-components';

import { ReactChildrenType } from '../../../types/ReactChildrenTypes';

const StyledButton = styled('button')`
  max-width: 350px;
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

    :not(.button--disabled):hover {
      background-color: var(--pink);
      box-shadow: 0 0 14px #ba0dd7;
    }
  }

  &.button--secondary {
    background-color: var(--plum);
    color: var(--lavendar);

    :not(.button--disabled):hover {
      background-color: #320d57;
      box-shadow: 0 0 14px rgba(186, 13, 215, 0.6);
    }
  }

  &.button--link {
    padding: 0;
  }

  &.button--small {
    padding: 5px 20px;
    border-radius: 4px;
  }

  &.button--disabled {
    cursor: default;

    a {
      cursor: default;
    }
  }

  a {
    display: block;
    padding: 16px 20px;
    text-decoration: none;
    color: inherit;
  }
`;

const Button = ({ children, isPrimary, isSecondary, isSmall, isDisabled, className, ...props }) => {
  const isLink = !Array.isArray(children) && (children.type === Link || children.type === 'a');

  return (
    <StyledButton
      {...props}
      className={classNames('button', className, {
        'button--primary': isPrimary,
        'button--secondary': isSecondary,
        'button--link': isLink,
        'button--small': isSmall,
        'button--disabled': isDisabled,
      })}
    >
      {children}
    </StyledButton>
  );
};

Button.propTypes = {
  children: ReactChildrenType,
  isPrimary: PropTypes.bool,
  isSecondary: PropTypes.bool,
  isSmall: PropTypes.bool,
  isDisabled: PropTypes.bool,
  className: PropTypes.string,
};

Button.defaultProps = {
  isPrimary: false,
  isSecondary: false,
  isSmall: false,
  isDisabled: false,
};

export default Button;
