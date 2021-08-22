import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styled from 'styled-components';

import { hideArrowsForNumberInput } from '~/styles/mixins';

import { TextInputType } from '~/types/InputTypes';
import { SmallText } from '~/components/common/typography';

const StyledContainer = styled('div')`
  position: relative;
  display: flex;
  flex-direction: column;

  label {
    line-height: 24px;
    margin-bottom: 10px;

    &.label--disabled {
      opacity: 50%;
    }
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

    &--error {
      background-color: rgba(var(--error-base), 0.4);
    }

    &--disabled {
      opacity: 50%;
    }
  }

  .max-length {
    position: absolute;
    bottom: 5px;
    right: 5px;
    font-size: 11px;
    line-height: 18px;
    color: var(--lavendar);
    user-select: none;
    cursor: default;
  }

  .small-text.required-warning,
  .small-text.length-warning {
    position: absolute;
    bottom: -25px;
    margin: 0;
  }
`;

const Input = ({
  type,
  name,
  labelText,
  maxLength,
  onChange,
  value,
  isRequired,
  isSmall,
  isError,
  isDisabled,
  className,
  autoFocus,
  ...rest
}) => {
  const [isRequiredAndSkipped, setIsRequiredAndSkipped] = useState(false);
  const [inputLength, setInputLength] = useState(value?.length ? value.length : 0);

  const processInputChange = (e) => {
    if (maxLength && e.target.value.length > maxLength) {
      setIsRequiredAndSkipped(false);
    }

    setInputLength(e.target.value.length);

    onChange(e);
  };

  const maxLengthExceeded = () => !!(maxLength && inputLength > maxLength);

  const onInputBlur = (inputValue) => {
    if (isRequired && !inputValue) {
      setIsRequiredAndSkipped(true);
    } else {
      setIsRequiredAndSkipped(false);
    }
  };

  const inputElement = useRef(null);

  useEffect(() => {
    if (inputElement.current) {
      if (autoFocus) {
        inputElement.current.focus();
      }
    }
  }, [inputElement.current]);

  return (
    <StyledContainer isDisabled={isDisabled} className="form-group">
      {labelText && (
        <label
          className={classNames({
            'label--disabled': isDisabled,
          })}
        >
          {labelText}
        </label>
      )}
      <input
        type={type}
        name={name}
        required={isRequired}
        autoComplete="off"
        className={classNames('input', className, {
          'input--small': isSmall,
          'input--error': isError,
          'input--disabled': isDisabled,
        })}
        onBlur={(e) => onInputBlur(e.target.value)}
        disabled={isDisabled}
        onChange={(e) => processInputChange(e)}
        value={value}
        ref={(element) => {
          inputElement.current = element;
        }}
        {...rest}
      />
      {maxLength && (
        <div className="max-length">
          {inputLength} / {maxLength}
        </div>
      )}
      {maxLengthExceeded() && (
        <SmallText isError className="length-warning">
          Sorry, it looks like you’ve exceeded the character limit
        </SmallText>
      )}
      {isRequiredAndSkipped && (
        <SmallText isError className="required-warning">
          Required
        </SmallText>
      )}
    </StyledContainer>
  );
};

Input.propTypes = {
  type: TextInputType,
  name: PropTypes.string.isRequired,
  labelText: PropTypes.string,
  maxLength: PropTypes.number,
  onChange: PropTypes.func,
  value: PropTypes.string,
  isRequired: PropTypes.bool,
  isSmall: PropTypes.bool,
  isError: PropTypes.bool,
  isDisabled: PropTypes.bool,
  autoFocus: PropTypes.bool,
  className: PropTypes.string,
};

Input.defaultProps = {
  type: 'text',
  onChange: () => {},
};

export default Input;
