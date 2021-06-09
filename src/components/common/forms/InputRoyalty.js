import React from 'react';
import styled from 'styled-components';

import InputSignAside from './InputSignAside';

import { APP } from '~/constants';

const StyledContainer = styled('div')`
  .input {
    width: 90px;
  }

  .aside {
    color: #ffffff;
  }
`;

const InputRoyalty = ({ ...rest }) => (
  <StyledContainer>
    <InputSignAside
      type="number"
      sign="%"
      detailsText="Royalty fees are how much you earn each time your art is resold. Typically people do between 5-10% If you collaborated, add your collaborator to get a cut too! "
      min={APP.MIN_CREATOR_ROYALTY}
      max={APP.MAX_ROYALTY}
      {...rest}
    />
  </StyledContainer>
);

export default InputRoyalty;
