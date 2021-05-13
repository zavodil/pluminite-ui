import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import InputSignAside from './InputSignAside';

import { useDebounce } from '../../../hooks';
import { getUSDsFromNear } from '../../../apis';

const InputNear = ({ labelText, isRequired = true, name }) => {
  const [nears, setNears] = useState('');
  const [USDs, setUSDs] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(nears, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      getUSDsFromNear(debouncedSearchTerm).then((results) => {
        setIsSearching(false);
        setUSDs(results);
      });
    } else {
      setUSDs(null);
      setIsSearching(false);
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    setIsSearching(true);
  }, [nears]);

  return (
    <InputSignAside
      labelText={labelText}
      name={name}
      sign="Ⓝ"
      isRequired={isRequired}
      inputOnChange={setNears}
      asideText={USDs && !isSearching ? `~${Math.round(USDs * 1000) / 1000} USD` : null}
    />
  );
};

InputNear.propTypes = {
  labelText: PropTypes.string,
  name: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
};

export default InputNear;
