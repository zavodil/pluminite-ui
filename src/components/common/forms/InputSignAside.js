import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { SmallText } from '../typography';
import InputSign from './InputSign';

const StyledContainer = styled('div')`
  display: flex;
  flex-direction: column;
  margin-bottom: 50px;

  .form-group {
    margin-bottom: 0;
  }

  label {
    line-height: 24px;
    margin-bottom: 10px;
  }

  .small-text {
    margin-bottom: 16px;
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
`;

const InputSignAside = ({ labelText, detailsText, asideText, ...rest }) => {
  return (
    <StyledContainer className="form-group">
      {labelText && <label>{labelText}</label>}
      {detailsText && <SmallText>{detailsText}</SmallText>}
      <div className="aside-wrapper">
        <InputSign {...rest} />
        {asideText && <div className="aside">{asideText}</div>}
      </div>
    </StyledContainer>
  );
};

InputSignAside.propTypes = {
  labelText: PropTypes.string,
  asideText: PropTypes.string,
  detailsText: PropTypes.string,
};

export default InputSignAside;
