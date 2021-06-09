import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { SmallText } from '~/components/common/typography';
import InputSign from './InputSign';

const StyledContainer = styled('div')`
  display: flex;
  flex-direction: column;
  margin-bottom: 50px;
  opacity: ${({ isDisabled }) => (isDisabled ? '50%' : '100%')};

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
    font-size: ${({ isSmall }) => (isSmall ? '13px' : 'inherit')};
    color: var(--periwinkle);
  }
`;

const InputSignAside = ({ labelText, detailsText, asideText, isSmall, isDisabled, ...rest }) => {
  return (
    <StyledContainer isSmall={isSmall} isDisabled={isDisabled} className="form-group input-sign-aside">
      {labelText && <label>{labelText}</label>}
      {detailsText && <SmallText>{detailsText}</SmallText>}
      <div className="aside-wrapper">
        <InputSign isSmall={isSmall} disabled={isDisabled} {...rest} />
        {asideText && <div className="aside">{asideText}</div>}
      </div>
    </StyledContainer>
  );
};

InputSignAside.propTypes = {
  labelText: PropTypes.string,
  asideText: PropTypes.string,
  detailsText: PropTypes.string,
  isSmall: PropTypes.bool,
  isDisabled: PropTypes.bool,
};

export default InputSignAside;
