import { formatNearAmount } from 'near-api-js/lib/utils/format';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';

import { MarketContractContext } from '~/contexts';
import { Button } from '~/components/common/buttons';

import { TitleText } from '~/components/common/typography';

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 0 28px;
  text-align: center;

  h3 {
    margin-bottom: 30px;
  }
`;

const MintNotAllowed = ({ location }) => {
  const { payStorage, minStorage } = useContext(MarketContractContext);

  if (location?.state?.isMintAllowed !== false) {
    return <Redirect to="/" />;
  }

  return (
    <Container>
      <TitleText>
        To be able to mint nft-s <br /> make storage deposit
      </TitleText>
      <Button isPrimary onClick={payStorage}>
        Deposit {formatNearAmount(minStorage)}Ⓝ
      </Button>
    </Container>
  );
};

MintNotAllowed.propTypes = {
  isMintAllowed: PropTypes.bool,
  location: PropTypes.shape({
    state: PropTypes.shape({
      isMintAllowed: PropTypes.bool,
    }),
  }),
};

export default MintNotAllowed;
