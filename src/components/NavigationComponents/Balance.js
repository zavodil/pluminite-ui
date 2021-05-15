import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { formatNearAmount } from 'near-api-js/lib/utils/format';

import { NearContext } from '../../contexts';
import { getUSDsFromNear } from '../../apis';

const StyledSpan = styled('span')`
  display: inline-flex;
  align-items: center;

  span {
    white-space: nowrap;
  }

  span:first-child {
    margin-right: 4px;
  }
`;

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
    <StyledSpan {...props}>
      <span className="nears">{nearRounded} Ⓝ</span>{' '}
      <span className="usds">{USDs && `~$${Math.round(USDs * 1000) / 1000} USD`}</span>
    </StyledSpan>
  );
};

export default Balance;
