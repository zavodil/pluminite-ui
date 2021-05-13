import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { hideArrowsForNumberInput } from '../../../styles/mixins';
import { SmallText } from '../typography';

const StyledContainer = styled('div')`
  display: flex;
  flex-direction: column;
  margin-bottom: 50px;

  label {
    line-height: 24px;
    margin-bottom: 10px;
  }

  .small-text {
    margin-bottom: 16px;
  }

  input {
    ${hideArrowsForNumberInput};

    height: 55px;
    width: 135px;
    padding: 16px 40px 16px 14px;
    border: none;
    border-bottom: var(--lavendar) 1px solid;
    background-color: rgba(var(--periwinkle-base), 0.2);
    outline: none;
    font-size: 16px;
    color: #ffffff;
    text-align: end;
  }

  .aside-wrapper {
    display: flex;
    flex-direction: row;
  }

  .aside {
    display: flex;
    align-items: center;
    margin-left: 22px;
    color: var(--periwinkle);
  }

  .sign-wrapper {
    position: relative;
    width: fit-content;
  }

  .sign {
    position: absolute;
    top: 0;
    right: 0;
    padding: 16px 14px;
    font-family: Comfortaa, 'sans-serif';
    font-size: 18px;
    line-height: 24px;
    color: darkgray;
    cursor: default;
  }
`;

const InputSignAside = ({
  labelText,
  detailsText,
  isRequired = true,
  name,
  sign,
  inputOnChange = () => {},
  asideText,
  ...rest
}) => {
  return (
    <StyledContainer className="form-group">
      {labelText && <label>{labelText}</label>}
      {detailsText && <SmallText>{detailsText}</SmallText>}
      <div className="aside-wrapper">
        <div className="sign-wrapper">
          <input
            type="number"
            name={name}
            required={isRequired}
            autoComplete="off"
            onChange={(e) => inputOnChange(e.target.value)}
            {...rest}
          />
          <div className="sign">{sign}</div>
        </div>
        {asideText && <div className="aside">{asideText}</div>}
      </div>
    </StyledContainer>
  );
};

InputSignAside.propTypes = {
  labelText: PropTypes.string,
  asideText: PropTypes.string,
  detailsText: PropTypes.string,
  sign: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
  inputOnChange: PropTypes.func,
};

export default InputSignAside;
