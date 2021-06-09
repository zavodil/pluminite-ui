import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import styled from 'styled-components';

import { ReactChildrenType } from '~/types/ReactChildrenTypes';

const StyledButton = styled('button')`
  max-width: 350px;
  padding: 16px 20px;
  border: 1px solid var(--lavendar);
  border-radius: var(--radius-default);
  font-family: var(--font-primary);
  font-size: 16px;
  text-decoration: none;
  cursor: pointer;
  transition: 100ms;

  &.button--bare {
    padding: 0;
    border: none;
    background: none;
    color: var(--lavendar);
  }

  &.button--primary {
    border-color: var(--lavendar);
    background-color: var(--lavendar);
    color: var(--plum);

    :not(.button--disabled):hover {
      background-color: var(--pink);
      box-shadow: var(--shadow-primary);
    }
  }

  &.button--secondary {
    background-color: var(--plum);
    color: var(--lavendar);

    :not(.button--disabled):hover {
      background-color: #320d57;
      box-shadow: var(--shadow-secondary);
    }
  }

  a {
    display: block;
    padding: 16px 20px;
    text-decoration: none;
    color: inherit;
  }

  &.button--small {
    padding: 5px 20px;
    border-radius: calc(var(--radius-default) / 2);

    a {
      padding: 5px 20px;
    }
  }

  &.button--link {
    padding: 0;
  }

  &.button--disabled {
    cursor: default;
    opacity: 50%;

    a {
      cursor: default;
    }
  }
`;

const Button = ({ children, isPrimary, isSecondary, isSmall, isDisabled, className, ...props }) => {
  const isLink = !Array.isArray(children) && (children.type === Link || children.type === 'a');

  return (
    <StyledButton
      {...props}
      className={classNames('button', className, {
        'button--bare': !isPrimary && !isSecondary,
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
