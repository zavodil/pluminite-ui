import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styled from 'styled-components';

import { hideArrowsForNumberInput } from '../../../styles/mixins';

import { TextInputType } from '../../../types/InputTypes';

const StyledContainer = styled('div')`
  display: flex;
  flex-direction: column;
  margin-bottom: 50px;

  label {
    line-height: 24px;
    margin-bottom: 10px;
  }

  .input {
    ${hideArrowsForNumberInput};

    height: 55px;
    padding: 16px 14px;
    border: none;
    border-bottom: var(--lavendar) 1px solid;
    background-color: rgba(var(--periwinkle-base), 0.2);
    outline: none;
    font-family: var(--font-primary);
    font-size: 16px;
    color: white;

    &--small {
      height: 45px;
      padding: 13px 12px;
      font-size: 13px;
      line-height: 18px;
    }
  }
`;

const Input = ({ labelText, type, isRequired, name, isSmall, className, ...rest }) => (
  <StyledContainer className="form-group">
    {labelText && <label>{labelText}</label>}
    <input
      type={type}
      name={name}
      required={isRequired}
      autoComplete="off"
      className={classNames('input', className, {
        'input--small': isSmall,
      })}
      {...rest}
    />
  </StyledContainer>
);

Input.propTypes = {
  labelText: PropTypes.string,
  type: TextInputType,
  isRequired: PropTypes.bool,
  name: PropTypes.string.isRequired,
  isSmall: PropTypes.bool,
  className: PropTypes.string,
};

Input.defaultProps = {
  type: 'text',
  isRequired: true,
};

export default Input;
