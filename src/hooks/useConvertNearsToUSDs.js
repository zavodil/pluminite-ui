import { useEffect, useState } from 'react';

import { getUSDsFromNear } from '~/apis';

import useIsUnmounting from './useIsUnmounting';

const useConvertNearsToUSDs = (nears) => {
  const [USDs, setUSDs] = useState(null);
  const isUnmounting = useIsUnmounting();

  const nearsNormalized = nears && String(nears).replaceAll(',', '');

  useEffect(() => {
    getUSDsFromNear(nearsNormalized).then((usdsFromNears) => {
      if (!isUnmounting) {
        setUSDs(usdsFromNears);
      }
    });
  }, [nears]);

  return USDs;
};

export default useConvertNearsToUSDs;
