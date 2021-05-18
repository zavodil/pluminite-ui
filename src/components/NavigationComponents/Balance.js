import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { formatNearAmount } from 'near-api-js/lib/utils/format';

import { round } from '../../utils/numbers';

import { NearContext } from '../../contexts';

import { withUSDs } from '../../hooks';

const StyledSpan = styled('span')`
  display: inline-flex;
  align-items: center;
  font-family: var(--font-secondary);

  span {
    white-space: nowrap;
  }

  .nears {
    margin-right: 4px;
  }

  .usds {
    font-size: 0.75em;
  }
`;

const Balance = ({ precision, ...props }) => {
  const { user } = useContext(NearContext);

  const nearFormatted = formatNearAmount(user.balance);
  const nearRounded = round(nearFormatted, precision);

  const USDs = withUSDs(nearRounded);

  return (
    <StyledSpan className="balance-text" {...props}>
      <span className="nears">{nearRounded} Ⓝ</span>{' '}
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
