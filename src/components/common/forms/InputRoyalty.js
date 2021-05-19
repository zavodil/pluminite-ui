import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import InputSignAside from './InputSignAside';

import { useDebounce } from '../../../hooks';

import { APP } from '../../../constants';

const StyledContainer = styled('div')`
  .input {
    width: 90px;
  }

  .aside {
    color: #ffffff;
  }
`;

const InputRoyalty = ({ ...rest }) => {
  const [royalty, setRoyalty] = useState(APP.DEFAULT_ROYALTY);
  const debouncedRoyalty = useDebounce(royalty, 500);

  useEffect(() => {
    if (debouncedRoyalty < APP.MIN_ROYALTY) {
      setRoyalty(APP.MIN_ROYALTY);
    } else if (debouncedRoyalty > APP.MAX_ROYALTY) {
      setRoyalty(APP.MAX_ROYALTY);
    }
  }, [debouncedRoyalty]);

  return (
    <StyledContainer>
      <InputSignAside
        type="number"
        sign="%"
        onChange={(e) => setRoyalty(e.target.value)}
        detailsText="Royalty fees are how much you earn each time your art is resold. Typically people do between 5-10% If you collaborated, add your collaborator to get a cut too! "
        min={APP.MIN_ROYALTY}
        max={APP.MAX_ROYALTY}
        value={royalty}
        {...rest}
      />
    </StyledContainer>
  );
};

export default InputRoyalty;
