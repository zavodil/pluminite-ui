import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

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

  input {
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
  }
`;

const Input = ({ labelText, type = 'text', isRequired = true, name, ...rest }) => (
  <StyledContainer className="form-group">
    {labelText && <label>{labelText}</label>}
    <input type={type} name={name} required={isRequired} autoComplete="off" {...rest} />
  </StyledContainer>
);

Input.propTypes = {
  labelText: PropTypes.string,
  type: TextInputType,
  name: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
};

export default Input;
