import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import InputSignAside from './InputSignAside';

import { useDebounce, useIsUnmounting } from '~/hooks';
import { getUSDsFromNear } from '~/apis';

import { APP } from '~/constants';

import { round } from '~/utils/numbers';

const InputNear = ({ nearsInitial, onNearsChange, ...rest }) => {
  const [nears, setNears] = useState(nearsInitial || '');
  const [USDs, setUSDs] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedNears = useDebounce(nears, 500);
  const isUnmounting = useIsUnmounting();

  const processNearsChange = (value) => {
    setNears(value);
    onNearsChange(value);
  };

  useEffect(() => {
    if (debouncedNears !== '') {
      let nearsForExchange;
      if (debouncedNears < APP.MIN_NEARS) {
        processNearsChange(APP.MIN_NEARS);
        nearsForExchange = APP.MIN_NEARS;
      } else {
        nearsForExchange = debouncedNears;
      }

      getUSDsFromNear(nearsForExchange).then((results) => {
        if (!isUnmounting) {
          setIsSearching(false);
          setUSDs(results);
        }
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
      onChange={(e) => processNearsChange(e.target.value)}
      asideText={USDs !== null && !isSearching ? `~${round(USDs, 2)} USD` : null}
      min={APP.MIN_NEARS}
      value={nears}
      {...rest}
    />
  );
};

InputNear.propTypes = {
  nears: PropTypes.string,
  nearsInitial: PropTypes.string,
  onNearsChange: PropTypes.func,
  setNears: PropTypes.func,
};

InputNear.defaultProps = {
  onNearsChange: () => {},
};

export default InputNear;
