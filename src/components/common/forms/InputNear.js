import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import InputSignAside from './InputSignAside';

import { useDebounce } from '../../../hooks';
import { getUSDsFromNear } from '../../../apis';

import { APP } from '../../../constants';

const InputNear = ({ labelText, isRequired = true, name }) => {
  const [nears, setNears] = useState('');
  const [USDs, setUSDs] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedNears = useDebounce(nears, 500);

  useEffect(() => {
    if (debouncedNears !== '') {
      let nearsForExchange;
      if (debouncedNears < APP.MIN_NEARS) {
        setNears(APP.MIN_NEARS);
        nearsForExchange = APP.MIN_NEARS;
      } else {
        nearsForExchange = debouncedNears;
      }

      getUSDsFromNear(nearsForExchange).then((results) => {
        setIsSearching(false);
        setUSDs(results);
      });
    } else {
      setUSDs(null);
      setIsSearching(false);
    }
  }, [debouncedNears]);

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
      asideText={USDs !== null && !isSearching ? `~${Math.round(USDs * 1000) / 1000} USD` : null}
      min={APP.MIN_NEARS}
      value={nears}
    />
  );
};

InputNear.propTypes = {
  labelText: PropTypes.string,
  name: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
};

export default InputNear;
