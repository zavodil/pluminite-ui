import { useEffect, useState } from 'react';

import { getUSDsFromNear } from '../apis';

const withUSDs = (nears) => {
  const [USDs, setUSDs] = useState(null);

  useEffect(() => {
    getUSDsFromNear(nears).then((usdsFromNears) => {
      setUSDs(usdsFromNears);
    });
  }, [nears]);

  return USDs;
};

export default withUSDs;
