import React, { useContext, useEffect, useState } from 'react';
import { formatNearAmount } from 'near-api-js/lib/utils/format';

import { NearContext } from '../../contexts';
import { getUSDsFromNear } from '../../apis';

const Balance = ({ ...props }) => {
  const { user } = useContext(NearContext);
  const [USDs, setUSDs] = useState(null);

  const nearFormatted = formatNearAmount(user.balance);
  const nearRounded = Math.round(nearFormatted * 1000) / 1000;

  useEffect(() => {
    getUSDsFromNear(nearRounded).then((usdsFromNears) => {
      setUSDs(usdsFromNears);
    });
  }, []);

  return (
    <span {...props}>
      Balance: {nearRounded}Ⓝ {USDs && `~$${Math.round(USDs * 1000) / 1000} USD`}
    </span>
  );
};

export default Balance;
