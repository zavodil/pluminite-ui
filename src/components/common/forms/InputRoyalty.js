import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import InputSignAside from './InputSignAside';

import { useDebounce } from '../../../hooks';

const defaultRoyalty = 5;
const minRoyalty = 0;
const maxRoyalty = 97;

const StyledContainer = styled('div')`
  .aside {
    color: #ffffff;
  }
`;

const InputRoyalty = ({ labelText, isRequired = true, name, asideText }) => {
  const [royalty, setRoyalty] = useState(defaultRoyalty);
  const debouncedRoyalty = useDebounce(royalty, 500);

  useEffect(() => {
    if (debouncedRoyalty < minRoyalty) {
      setRoyalty(minRoyalty);
    } else if (debouncedRoyalty > maxRoyalty) {
      setRoyalty(maxRoyalty);
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
        min={minRoyalty}
        max={maxRoyalty}
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
