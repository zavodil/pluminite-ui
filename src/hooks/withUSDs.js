import { useEffect, useState } from 'react';

import { getUSDsFromNear } from '../apis';

const withUSDs = (nears) => {
  const [USDs, setUSDs] = useState(null);

  const nearsNormalized = nears.replaceAll(',', '');

  useEffect(() => {
    getUSDsFromNear(nearsNormalized).then((usdsFromNears) => {
      setUSDs(usdsFromNears);
    });
  }, [nears]);

  return USDs;
};

export default withUSDs;
