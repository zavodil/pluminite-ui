import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import InputSignAside from './InputSignAside';

import { useDebounce } from '../../../hooks';

import { APP } from '../../../constants';

const StyledContainer = styled('div')`
  .aside {
    color: #ffffff;
  }
`;

const InputRoyalty = ({ labelText, isRequired = true, name, asideText }) => {
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
        labelText={labelText}
        name={name}
        sign="%"
        isRequired={isRequired}
        asideText={asideText}
        inputOnChange={setRoyalty}
        detailsText="The royalty is the amount you earn from each resale of your NFT. You can customize royalty splits with collaborators or anyone else with a NEAR wallet."
        min={APP.MIN_ROYALTY}
        max={APP.MAX_ROYALTY}
        value={royalty}
      />
    </StyledContainer>
  );
};

InputRoyalty.propTypes = {
  labelText: PropTypes.string,
  asideText: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
};

export default InputRoyalty;
