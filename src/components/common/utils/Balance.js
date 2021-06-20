import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { convertYoctoNearsToNears } from '~/utils/nears';
import { round } from '~/utils/numbers';

import { NearContext } from '~/contexts';

import { useConvertNearsToUSDs } from '~/hooks';

const StyledSpan = styled('span')`
  display: inline-flex;
  align-items: center;
  font-family: var(--font-secondary);

  span {
    white-space: nowrap;
  }

  .nears-sign {
    margin-right: 4px;
  }

  .usds {
    font-size: 0.75em;
  }
`;

const Balance = ({ precision, ...props }) => {
  const { user } = useContext(NearContext);

  const nears = convertYoctoNearsToNears(user.balance, precision);

  const USDs = useConvertNearsToUSDs(nears);

  return (
    <StyledSpan className="balance-text" {...props}>
      <span className="nears">{Number(nears).toLocaleString()}</span> <span className="nears-sign">Ⓝ</span>{' '}
      <span className="usds">{USDs && `~$${round(USDs, precision)} USD`}</span>
    </StyledSpan>
  );
};

Balance.propTypes = {
  precision: PropTypes.number,
};

Balance.defaultProps = {
  precision: 0,
};

export default Balance;
