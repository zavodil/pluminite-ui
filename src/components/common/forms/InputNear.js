import React, { useEffect, useState } from 'react';

import InputSignAside from './InputSignAside';

import { useDebounce } from '../../../hooks';
import { getUSDsFromNear } from '../../../apis';

import { APP } from '../../../constants';

import { round } from '../../../utils/numbers';

const InputNear = ({ ...rest }) => {
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
      type="number"
      sign="Ⓝ"
      onChange={(e) => setNears(e.target.value)}
      asideText={USDs !== null && !isSearching ? `~${round(USDs, 2)} USD` : null}
      min={APP.MIN_NEARS}
      value={nears}
      {...rest}
    />
  );
};

export default InputNear;
